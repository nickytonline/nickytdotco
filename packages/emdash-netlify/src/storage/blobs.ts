import { getStore, type Store } from "@netlify/blobs";
import { createStorage as createLocalStorage } from "emdash/storage/local";

interface ByteRange {
  offset: number;
  length?: number;
  suffix?: number;
}

interface DownloadOptions {
  range?: ByteRange;
}

interface UploadOptions {
  key: string;
  body: Buffer | Uint8Array | ReadableStream<Uint8Array>;
  contentType: string;
  cacheControl?: string;
}

interface UploadResult {
  key: string;
  url: string;
  size: number;
}

interface DownloadResult {
  body: ReadableStream<Uint8Array>;
  contentType: string;
  size: number;
  range?: { offset: number; length: number };
  lastModified?: Date;
}

interface ListOptions {
  prefix?: string;
  limit?: number;
  cursor?: string;
}

interface FileInfo {
  key: string;
  size: number;
  lastModified: Date;
  etag?: string;
}

interface ListResult {
  files: FileInfo[];
  nextCursor?: string;
}

interface SignedUploadOptions {
  key: string;
  contentType: string;
  size?: number;
  expiresIn?: number;
}

interface SignedUploadUrl {
  url: string;
  method: "PUT";
  headers: Record<string, string>;
  expiresAt: string;
}

interface Storage {
  upload(options: UploadOptions): Promise<UploadResult>;
  download(key: string, options?: DownloadOptions): Promise<DownloadResult>;
  delete(key: string): Promise<void>;
  exists(key: string): Promise<boolean>;
  list(options?: ListOptions): Promise<ListResult>;
  getSignedUploadUrl(options: SignedUploadOptions): Promise<SignedUploadUrl>;
  getPublicUrl(key: string): string;
}

interface BlobMetadata {
  contentType?: string;
  size?: number;
  lastModified?: string;
  cacheControl?: string;
}

class StorageError extends Error {
  code: string;

  constructor(message: string, code: string, cause?: unknown) {
    super(message, cause === undefined ? undefined : { cause });
    this.name = "EmDashStorageError";
    this.code = code;
  }
}

function stringConfig(
  config: Record<string, unknown>,
  key: string,
  fallback: string
): string {
  const value = config[key];
  return typeof value === "string" && value.length > 0 ? value : fallback;
}

function resolveByteRange(
  range: ByteRange,
  size: number
): { offset: number; length: number } | undefined {
  if (size <= 0) return undefined;
  if (typeof range.suffix === "number") {
    const length = Math.min(Math.max(range.suffix, 0), size);
    if (length === 0) return undefined;
    return { offset: size - length, length };
  }
  if (range.offset >= size || range.offset < 0) return undefined;
  const available = size - range.offset;
  const length =
    range.length === undefined
      ? available
      : Math.min(Math.max(range.length, 0), available);
  if (length === 0) return undefined;
  return { offset: range.offset, length };
}

async function toUint8Array(
  body: Buffer | Uint8Array | ReadableStream<Uint8Array>
): Promise<Uint8Array> {
  if (body instanceof Uint8Array) return body;
  const buffer = await new Response(body).arrayBuffer();
  return new Uint8Array(buffer);
}

function asArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  const copy = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(copy).set(bytes);
  return copy;
}

function streamFromBytes(bytes: Uint8Array): ReadableStream<Uint8Array> {
  const copy = new Uint8Array(asArrayBuffer(bytes));
  return new ReadableStream({
    start(controller) {
      controller.enqueue(copy);
      controller.close();
    },
  });
}

function metadataOf(value: unknown): BlobMetadata {
  if (!value || typeof value !== "object") return {};
  const record = value as Record<string, unknown>;
  return {
    contentType:
      typeof record.contentType === "string" ? record.contentType : undefined,
    size: typeof record.size === "number" ? record.size : undefined,
    lastModified:
      typeof record.lastModified === "string" ? record.lastModified : undefined,
    cacheControl:
      typeof record.cacheControl === "string" ? record.cacheControl : undefined,
  };
}

/**
 * EmDash storage backed by a site-wide Netlify Blobs store.
 * Blobs has no signed upload URL, so `getSignedUploadUrl` throws
 * `NOT_SUPPORTED` and the admin uploads through the API instead.
 */
export class NetlifyBlobsStorage implements Storage {
  private storeName: string;
  private baseUrl: string;
  private openStore: (name: string) => Store;

  constructor(
    config: Record<string, unknown>,
    openStore: (name: string) => Store = (name) => getStore(name)
  ) {
    this.storeName = stringConfig(config, "store", "emdash-media");
    this.baseUrl = stringConfig(
      config,
      "baseUrl",
      "/_emdash/api/media/file"
    ).replace(/\/$/, "");
    this.openStore = openStore;
  }

  private store(): Store {
    return this.openStore(this.storeName);
  }

  getPublicUrl(key: string): string {
    return `${this.baseUrl}/${key}`;
  }

  async upload(options: UploadOptions): Promise<UploadResult> {
    try {
      const bytes = await toUint8Array(options.body);
      const lastModified = new Date().toISOString();
      await this.store().set(options.key, asArrayBuffer(bytes), {
        metadata: {
          contentType: options.contentType,
          size: bytes.byteLength,
          lastModified,
          ...(options.cacheControl
            ? { cacheControl: options.cacheControl }
            : {}),
        },
      });
      return {
        key: options.key,
        url: this.getPublicUrl(options.key),
        size: bytes.byteLength,
      };
    } catch (error) {
      if (error instanceof StorageError) throw error;
      throw new StorageError(
        `Failed to upload file: ${options.key}`,
        "UPLOAD_FAILED",
        error
      );
    }
  }

  async download(
    key: string,
    options: DownloadOptions = {}
  ): Promise<DownloadResult> {
    try {
      const entry = await this.store().getWithMetadata(key, {
        type: "arrayBuffer",
      });
      if (!entry?.data)
        throw new StorageError(`File not found: ${key}`, "NOT_FOUND");
      const metadata = metadataOf(entry.metadata);
      const bytes = new Uint8Array(entry.data as ArrayBuffer);
      const size = metadata.size ?? bytes.byteLength;
      const range = options.range
        ? resolveByteRange(options.range, size)
        : undefined;
      const slice = range
        ? bytes.subarray(range.offset, range.offset + range.length)
        : bytes;
      return {
        body: streamFromBytes(slice),
        contentType: metadata.contentType ?? "application/octet-stream",
        size,
        lastModified: metadata.lastModified
          ? new Date(metadata.lastModified)
          : undefined,
        ...(range ? { range } : {}),
      };
    } catch (error) {
      if (error instanceof StorageError) throw error;
      throw new StorageError(
        `Failed to download file: ${key}`,
        "DOWNLOAD_FAILED",
        error
      );
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await this.store().delete(key);
    } catch (error) {
      throw new StorageError(
        `Failed to delete file: ${key}`,
        "DELETE_FAILED",
        error
      );
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const metadata = await this.store().getMetadata(key);
      return metadata !== null;
    } catch {
      return false;
    }
  }

  async list(options: ListOptions = {}): Promise<ListResult> {
    try {
      const prefix = options.prefix ?? "";
      const listed = await this.store().list({ prefix });
      const keys = listed.blobs.map((blob) => blob.key);
      const limit = options.limit ?? keys.length;
      const start = Number(options.cursor ?? "0");
      const startIndex = Number.isFinite(start) && start > 0 ? start : 0;
      const page = listed.blobs.slice(startIndex, startIndex + limit);
      const files = await Promise.all(
        page.map(async (blob) => {
          const metadata = metadataOf(
            (await this.store().getMetadata(blob.key))?.metadata
          );
          return {
            key: blob.key,
            size: metadata.size ?? 0,
            lastModified: metadata.lastModified
              ? new Date(metadata.lastModified)
              : new Date(0),
            etag: blob.etag,
          };
        })
      );
      const next = startIndex + limit;
      return {
        files,
        nextCursor: next < keys.length ? String(next) : undefined,
      };
    } catch (error) {
      if (error instanceof StorageError) throw error;
      throw new StorageError("Failed to list files", "LIST_FAILED", error);
    }
  }

  async getSignedUploadUrl(
    _options: SignedUploadOptions
  ): Promise<SignedUploadUrl> {
    throw new StorageError(
      "Netlify Blobs does not support signed upload URLs. Upload files directly through the API.",
      "NOT_SUPPORTED"
    );
  }
}

/**
 * Whether EmDash should use Netlify Blobs instead of the local filesystem.
 *
 * `process.env.NETLIFY` is unreliable in this site's Astro SSR bundle: Varlock
 * only injects schema keys, so platform vars like `NETLIFY` and `CONTEXT` are
 * often unset at runtime (same reason search reindex reads deploy context from
 * `Astro.locals.netlify`). Without Blobs, "Back up now" writes under
 * `.emdash/uploads` on the function's ephemeral disk and fails — the admin
 * toast is generic and may leave no useful function log.
 *
 * Prefer Blobs when Netlify signals are present, and in production builds
 * (`import.meta.env.PROD`), which on this adapter always target Netlify
 * Functions. `astro dev` stays on local disk.
 */
export function shouldUseNetlifyBlobs(): boolean {
  if (process.env.NETLIFY === "true") return true;
  if (process.env.NETLIFY_BLOBS_CONTEXT) return true;
  return import.meta.env.PROD === true;
}

/**
 * Runtime factory EmDash loads from the storage descriptor.
 * Netlify Functions use Blobs. Local `astro dev` uses disk.
 */
export function createStorage(config: Record<string, unknown>): Storage {
  if (shouldUseNetlifyBlobs()) return new NetlifyBlobsStorage(config);
  return createLocalStorage({
    directory: stringConfig(config, "localDirectory", ".emdash/uploads"),
    baseUrl: stringConfig(config, "baseUrl", "/_emdash/api/media/file"),
  });
}
