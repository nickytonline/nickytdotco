import { GoogleGenAI } from "@google/genai";
import { ENV } from "varlock/env";
import {
  SEARCH_EMBED_BATCH_DELAY_MS,
  SEARCH_EMBED_BATCH_SIZE,
  SEARCH_EMBEDDING_DIMENSIONS,
  SEARCH_EMBEDDING_MODEL,
} from "./constants.ts";
import { l2Normalize } from "./normalize.ts";

type EmbeddingTaskType = "RETRIEVAL_DOCUMENT" | "RETRIEVAL_QUERY";

let genAI: GoogleGenAI | undefined;

function getClient(): GoogleGenAI {
  if (!genAI) {
    genAI = new GoogleGenAI({ apiKey: ENV.GEMINI_API_KEY });
  }
  return genAI;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function errorMessage(error: unknown): string {
  if (!error || typeof error !== "object") {
    return String(error);
  }
  return String((error as { message?: string }).message ?? error);
}

function isRetryable(error: unknown): boolean {
  if (!error || typeof error !== "object") {
    return false;
  }
  const candidate = error as { status?: number; message?: string };
  if (candidate.status === 429 || candidate.status === 503) {
    return true;
  }
  const message = candidate.message?.toLowerCase() ?? "";
  return (
    message.includes("429") ||
    message.includes("resource exhausted") ||
    message.includes("unavailable")
  );
}

function retryDelayMs(error: unknown, fallbackMs: number): number {
  const match = errorMessage(error).match(
    /"retryDelay"\s*:\s*"(\d+(?:\.\d+)?)s"/
  );
  if (match) {
    return Math.max(fallbackMs, Math.ceil(Number(match[1]) * 1000));
  }
  return fallbackMs;
}

async function withRetry<T>(fn: () => Promise<T>): Promise<T> {
  let delayMs = 4000;
  let lastError: unknown;
  const maxAttempts = 10;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (!isRetryable(error) || attempt === maxAttempts - 1) {
        throw error;
      }
      const waitMs = retryDelayMs(error, delayMs);
      console.warn(
        `Gemini embedding rate-limited (attempt ${attempt + 1}/${maxAttempts}), waiting ${waitMs}ms`
      );
      await sleep(waitMs);
      delayMs = Math.min(delayMs * 2, 60000);
    }
  }
  throw lastError;
}

function embeddingFromResponse(response: {
  embeddings?: Array<{ values?: number[] }>;
}): number[] {
  const values = response.embeddings?.[0]?.values;
  if (!values?.length) {
    throw new Error("Gemini embedContent returned no embedding values.");
  }
  if (values.length !== SEARCH_EMBEDDING_DIMENSIONS) {
    throw new Error(
      `Expected ${SEARCH_EMBEDDING_DIMENSIONS} embedding dimensions, got ${values.length}.`
    );
  }
  return l2Normalize(values);
}

async function embedBatch(
  texts: string[],
  taskType: EmbeddingTaskType
): Promise<number[][]> {
  if (texts.length === 0) {
    return [];
  }

  const response = await withRetry(() =>
    getClient().models.embedContent({
      model: SEARCH_EMBEDDING_MODEL,
      contents: texts,
      config: {
        outputDimensionality: SEARCH_EMBEDDING_DIMENSIONS,
        taskType,
      },
    })
  );

  const embeddings = response.embeddings ?? [];
  if (embeddings.length !== texts.length) {
    throw new Error(
      `Expected ${texts.length} embeddings, got ${embeddings.length}.`
    );
  }

  return embeddings.map((embedding, index) => {
    const values = embedding.values;
    if (!values?.length) {
      throw new Error(`Gemini returned an empty embedding at index ${index}.`);
    }
    if (values.length !== SEARCH_EMBEDDING_DIMENSIONS) {
      throw new Error(
        `Expected ${SEARCH_EMBEDDING_DIMENSIONS} embedding dimensions, got ${values.length}.`
      );
    }
    return l2Normalize(values);
  });
}

export async function embedQuery(text: string): Promise<number[]> {
  const response = await withRetry(() =>
    getClient().models.embedContent({
      model: SEARCH_EMBEDDING_MODEL,
      contents: text,
      config: {
        outputDimensionality: SEARCH_EMBEDDING_DIMENSIONS,
        taskType: "RETRIEVAL_QUERY",
      },
    })
  );
  return embeddingFromResponse(response);
}

export async function embedDocuments(texts: string[]): Promise<number[][]> {
  const vectors: number[][] = [];
  for (let i = 0; i < texts.length; i += SEARCH_EMBED_BATCH_SIZE) {
    const chunk = texts.slice(i, i + SEARCH_EMBED_BATCH_SIZE);
    const embedded = await embedBatch(chunk, "RETRIEVAL_DOCUMENT");
    vectors.push(...embedded);
    if (i + SEARCH_EMBED_BATCH_SIZE < texts.length) {
      await sleep(SEARCH_EMBED_BATCH_DELAY_MS);
    }
  }
  return vectors;
}
