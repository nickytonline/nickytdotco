import { afterEach, describe, expect, it, vi } from "vitest";
import { createStorage, NetlifyBlobsStorage } from "./blobs.ts";

interface StoredBlob {
  bytes: Uint8Array;
  metadata: Record<string, unknown>;
  etag: string;
}

function memoryStore() {
  const objects = new Map<string, StoredBlob>();
  return {
    objects,
    store: {
      async set(
        key: string,
        value: Uint8Array | ArrayBuffer,
        options?: { metadata?: object }
      ) {
        const bytes =
          value instanceof Uint8Array ? value : new Uint8Array(value);
        objects.set(key, {
          bytes,
          metadata: { ...options?.metadata },
          etag: `"${objects.size + 1}"`,
        });
        return { modified: true, etag: `"${objects.size}"` };
      },
      async getWithMetadata(key: string) {
        const found = objects.get(key);
        if (!found) return null;
        return {
          data: found.bytes.buffer.slice(
            found.bytes.byteOffset,
            found.bytes.byteOffset + found.bytes.byteLength
          ),
          metadata: found.metadata,
          etag: found.etag,
        };
      },
      async getMetadata(key: string) {
        const found = objects.get(key);
        if (!found) return null;
        return { etag: found.etag, metadata: found.metadata };
      },
      async delete(key: string) {
        objects.delete(key);
      },
      async list(options?: { prefix?: string }) {
        const prefix = options?.prefix ?? "";
        return {
          blobs: [...objects.entries()]
            .filter(([key]) => key.startsWith(prefix))
            .map(([key, value]) => ({ key, etag: value.etag })),
        };
      },
    },
  };
}

describe("NetlifyBlobsStorage", () => {
  it("stores an object and reads it back with the saved metadata", async () => {
    const { store } = memoryStore();
    const storage = new NetlifyBlobsStorage(
      { baseUrl: "/_emdash/api/media/file" },
      () => store as never
    );
    const uploaded = await storage.upload({
      key: "photo.png",
      body: new Uint8Array([1, 2, 3, 4]),
      contentType: "image/png",
    });

    expect(uploaded).toMatchObject({
      key: "photo.png",
      url: "/_emdash/api/media/file/photo.png",
      size: 4,
    });
    expect(await storage.exists("photo.png")).toBe(true);

    const downloaded = await storage.download("photo.png");
    const bytes = new Uint8Array(
      await new Response(downloaded.body).arrayBuffer()
    );
    expect(bytes).toEqual(new Uint8Array([1, 2, 3, 4]));
    expect(downloaded.contentType).toBe("image/png");
    expect(downloaded.size).toBe(4);
  });

  it("serves a byte range and refuses signed upload URLs", async () => {
    const { store } = memoryStore();
    const storage = new NetlifyBlobsStorage({}, () => store as never);
    await storage.upload({
      key: "clip.bin",
      body: new Uint8Array([10, 20, 30, 40]),
      contentType: "application/octet-stream",
    });

    const partial = await storage.download("clip.bin", {
      range: { offset: 1, length: 2 },
    });
    const bytes = new Uint8Array(
      await new Response(partial.body).arrayBuffer()
    );
    expect(bytes).toEqual(new Uint8Array([20, 30]));
    expect(partial.range).toEqual({ offset: 1, length: 2 });

    await expect(
      storage.getSignedUploadUrl({
        key: "clip.bin",
        contentType: "application/octet-stream",
      })
    ).rejects.toMatchObject({ code: "NOT_SUPPORTED" });
  });

  it("lists by prefix and deletes without throwing when the key is already gone", async () => {
    const { store } = memoryStore();
    const storage = new NetlifyBlobsStorage({}, () => store as never);
    await storage.upload({
      key: "a/one.png",
      body: new Uint8Array([1]),
      contentType: "image/png",
    });
    await storage.upload({
      key: "b/two.png",
      body: new Uint8Array([2]),
      contentType: "image/png",
    });

    const listed = await storage.list({ prefix: "a/" });
    expect(listed.files.map((file) => file.key)).toEqual(["a/one.png"]);

    await storage.delete("a/one.png");
    await storage.delete("missing.png");
    expect(await storage.exists("a/one.png")).toBe(false);
  });
});

describe("createStorage", () => {
  const previous = process.env.NETLIFY;

  afterEach(() => {
    if (previous === undefined) delete process.env.NETLIFY;
    else process.env.NETLIFY = previous;
    vi.unstubAllEnvs();
  });

  it("uses the local filesystem adapter outside Netlify", () => {
    delete process.env.NETLIFY;
    const storage = createStorage({
      baseUrl: "/_emdash/api/media/file",
      localDirectory: ".emdash/uploads",
    });
    expect(storage.getPublicUrl("photo.png")).toBe(
      "/_emdash/api/media/file/photo.png"
    );
  });
});
