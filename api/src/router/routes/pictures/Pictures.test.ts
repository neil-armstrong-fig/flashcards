import {api} from "@src/testing/ApiHarness";
import {workerEnvironment} from "@src/env/WorkerEnvironment";
import type {PicturesBucket} from "@src/buckets/pictures/types/PicturesBucket";

const BYTES = new Uint8Array([1, 2, 3, 4, 5]);

async function hashOf(bytes: Uint8Array): Promise<string> {
  const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", bytes));

  return Array.from(digest, byte => byte.toString(16).padStart(2, "0")).join("");
}

class MemoryBucket implements PicturesBucket {
  readonly kept = new Map<string, {readonly bytes: ArrayBuffer; readonly type: string}>();

  async get(key: string): ReturnType<PicturesBucket["get"]> {
    const found = this.kept.get(key);

    if (!found) {
      return null;
    }

    return {body: found.bytes, httpMetadata: {contentType: found.type}};
  }

  async put(
    key: string,
    value: ArrayBuffer,
    options: {readonly httpMetadata: {readonly contentType: string}},
  ): Promise<void> {
    this.kept.set(key, {bytes: value, type: options.httpMetadata.contentType});
  }
}

let bucket = new MemoryBucket();

beforeEach(() => {
  bucket = new MemoryBucket();
  workerEnvironment.PICTURES = bucket;
});

afterEach(() => {
  Reflect.deleteProperty(workerEnvironment, "PICTURES");
});

async function keep(cookie: string, hash: string, data: Uint8Array, type = "image/webp"): Promise<Response> {
  return await api.send(`/api/pictures/${hash}`, {method: "PUT", cookie, bytes: {data, type}});
}

it("keeps a picture under its hash and gives the same bytes back", async () => {
  const cookie = await api.signIn();
  const hash = await hashOf(BYTES);

  expect((await keep(cookie, hash, BYTES)).status).toBe(204);

  const back = await api.send(`/api/pictures/${hash}`, {cookie});

  expect(back.status).toBe(200);
  expect(back.headers.get("Content-Type")).toBe("image/webp");
  expect(back.headers.get("Cache-Control")).toBe("private, max-age=31536000, immutable");
  expect(new Uint8Array(await back.arrayBuffer())).toEqual(BYTES);
});

it("keeps a picture once however often it is sent", async () => {
  const cookie = await api.signIn();
  const hash = await hashOf(BYTES);

  await keep(cookie, hash, BYTES);

  expect((await keep(cookie, hash, BYTES)).status).toBe(204);
  expect(bucket.kept.size).toBe(1);
});

it("refuses bytes that are not the hash they are sent under, so a hash can be trusted", async () => {
  const cookie = await api.signIn();

  expect((await keep(cookie, await hashOf(BYTES), new Uint8Array([9, 9]))).status).toBe(400);
  expect(bucket.kept.size).toBe(0);
});

it("refuses a picture over a megabyte, and a type that is not a picture", async () => {
  const cookie = await api.signIn();
  const big = new Uint8Array(1_048_577);

  expect((await keep(cookie, await hashOf(big), big)).status).toBe(413);
  expect((await keep(cookie, await hashOf(BYTES), BYTES, "text/html")).status).toBe(400);
  expect(bucket.kept.size).toBe(0);
});

it("refuses a name that is not a hash", async () => {
  const cookie = await api.signIn();

  expect((await keep(cookie, "not-a-hash", BYTES)).status).toBe(404);
  expect((await api.send("/api/pictures/not-a-hash", {cookie})).status).toBe(404);
});

it("has nothing for a picture that was not kept", async () => {
  const cookie = await api.signIn();

  expect((await api.send(`/api/pictures/${await hashOf(BYTES)}`, {cookie})).status).toBe(404);
});

it("keeps each account's pictures to itself", async () => {
  const mine = await api.signIn();
  const hash = await hashOf(BYTES);

  await keep(mine, hash, BYTES);

  const {testGoogle} = await import("@src/testing/google/TestGoogle");

  testGoogle.identity = {subject: "google-2", email: "me@example.com", emailVerified: true};

  expect((await api.send(`/api/pictures/${hash}`, {cookie: await api.signIn()})).status).toBe(404);
});

it("asks for a sign-in, and refuses a keep from another site", async () => {
  const hash = await hashOf(BYTES);
  const cookie = await api.signIn();

  expect((await api.send(`/api/pictures/${hash}`)).status).toBe(401);
  expect(
    (await api.send(`/api/pictures/${hash}`, {method: "PUT", bytes: {data: BYTES, type: "image/webp"}})).status,
  ).toBe(401);
  expect(
    (
      await api.send(`/api/pictures/${hash}`, {
        method: "PUT",
        cookie,
        origin: "https://evil.example",
        bytes: {data: BYTES, type: "image/webp"},
      })
    ).status,
  ).toBe(403);
});
