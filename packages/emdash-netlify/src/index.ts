import { fileURLToPath } from "node:url";

/**
 * Serializable storage descriptor. Matches the shape `emdash()` expects
 * (`entrypoint` + `config`) without importing EmDash at config-evaluation
 * time.
 */
export interface StorageDescriptor {
  entrypoint: string;
  config: Record<string, unknown>;
}

export interface NetlifyBlobsStorageConfig {
  /** Netlify Blobs store name. Defaults to `emdash-media`. */
  store?: string;
  /** Public URL prefix. EmDash serves bytes from this path. */
  baseUrl?: string;
  /**
   * Filesystem directory used when the process is not running on Netlify
   * (`astro dev`). Production functions use Blobs instead.
   */
  localDirectory?: string;
}

const storageEntrypoint = fileURLToPath(
  new URL("./storage/blobs.ts", import.meta.url)
);

/**
 * Netlify Blobs storage adapter for EmDash media.
 *
 * On Netlify the runtime reads and writes a site-wide Blobs store, which
 * persists across function invocations and deploys. Outside Netlify it falls
 * back to EmDash's local filesystem adapter so `astro dev` can upload media.
 *
 * Signed direct-to-storage uploads are not supported. The admin falls back
 * to uploading through the EmDash API.
 */
export function blobs(
  config: NetlifyBlobsStorageConfig = {}
): StorageDescriptor {
  return {
    entrypoint: storageEntrypoint,
    config: {
      store: config.store ?? "emdash-media",
      baseUrl: config.baseUrl ?? "/_emdash/api/media/file",
      localDirectory: config.localDirectory ?? ".emdash/uploads",
    },
  };
}
