import { GoogleGenAI } from "@google/genai";
import { ENV } from "varlock/env";
import {
  SEARCH_EMBED_BATCH_SIZE,
  SEARCH_EMBEDDING_DIMENSIONS,
  SEARCH_EMBEDDING_MODEL,
} from "./constants";
import { l2Normalize } from "./normalize";

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

async function withRetry<T>(fn: () => Promise<T>): Promise<T> {
  let delayMs = 1000;
  let lastError: unknown;
  for (let attempt = 0; attempt < 6; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (!isRetryable(error) || attempt === 5) {
        throw error;
      }
      await sleep(delayMs);
      delayMs = Math.min(delayMs * 2, 16000);
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
  }
  return vectors;
}
