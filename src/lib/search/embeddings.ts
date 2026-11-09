import { GoogleGenAI } from "@google/genai";
import { ENV } from "varlock/env";
import { isObject, isString } from "../../utils/type-guards.ts";
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

function errorMessage<ErrorValue>(error: ErrorValue): string {
  if (!isObject(error)) {
    return String(error);
  }

  const message = Object.entries(error).find(([key]) => key === "message")?.[1];

  return isString(message) ? message : String(error);
}

function isRetryable<ErrorValue>(error: ErrorValue): boolean {
  if (!isObject(error)) {
    return false;
  }

  const fields = new Map(Object.entries(error));
  const status = fields.get("status");

  if (status === 429 || status === 503) {
    return true;
  }

  const message = fields.get("message");
  const normalizedMessage = isString(message) ? message.toLowerCase() : "";

  return (
    normalizedMessage.includes("429") ||
    normalizedMessage.includes("resource exhausted") ||
    normalizedMessage.includes("unavailable")
  );
}

function retryDelayMs<ErrorValue>(
  error: ErrorValue,
  fallbackMs: number
): number {
  const match = errorMessage(error).match(
    /"retryDelay"\s*:\s*"(\d+(?:\.\d+)?)s"/
  );

  if (match) {
    return Math.max(fallbackMs, Math.ceil(Number(match[1]) * 1000));
  }

  return fallbackMs;
}

async function withRetry<T>(
  fn: () => Promise<T>,
  maxAttempts = 10
): Promise<T> {
  let delayMs = 4000;
  let lastError: unknown;

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
  const response = await withRetry(
    () =>
      getClient().models.embedContent({
        model: SEARCH_EMBEDDING_MODEL,
        contents: text,
        config: {
          outputDimensionality: SEARCH_EMBEDDING_DIMENSIONS,
          taskType: "RETRIEVAL_QUERY",
        },
      }),
    2
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
