import {serveRecording} from "@src/router/routes/audio/serve/ServeRecording";
import type {ByteRange} from "@language-learning/shared/http/types/ByteRange";
import type {StoredRecording} from "@src/buckets/recordings/types/StoredRecording";

const KEY = "ko/female-normal/c2f16032c0b9c1ea.mp3";
const BYTES = new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

/** One recording of ten bytes, and what the bucket does with a range: the stretch asked for, cut to the file. */
vi.mock("@src/buckets/recordings/ReadRecording", () => ({
  readRecording: async (key: string, range: ByteRange): Promise<StoredRecording | undefined> => {
    if (key !== KEY) {
      return undefined;
    }

    if (range.kind === "part") {
      const length = Math.max(0, Math.min(range.length, BYTES.length - range.offset));

      return {body: BYTES.slice(range.offset, range.offset + length), size: BYTES.length, offset: range.offset, length};
    }

    if (range.kind === "from") {
      const length = Math.max(0, BYTES.length - range.offset);

      return {body: BYTES.slice(range.offset), size: BYTES.length, offset: range.offset, length};
    }

    if (range.kind === "last") {
      const length = Math.min(range.length, BYTES.length);

      return {body: BYTES.slice(BYTES.length - length), size: BYTES.length, offset: BYTES.length - length, length};
    }

    return {body: BYTES, size: BYTES.length, offset: 0, length: BYTES.length};
  },
}));

function askFor(range?: string): Request {
  const headers = new Headers();

  if (range !== undefined) {
    headers.set("Range", range);
  }

  return new Request(`https://api.example/api/audio/${KEY}`, {headers});
}

it("serves the whole recording as audio that a browser may keep for ever, and only its own device", async () => {
  const response = await serveRecording(askFor(), KEY);

  expect(response.status).toBe(200);
  expect(response.headers.get("Content-Type")).toBe("audio/mpeg");
  expect(response.headers.get("Content-Length")).toBe("10");
  expect(response.headers.get("Accept-Ranges")).toBe("bytes");
  expect(response.headers.get("Cache-Control")).toBe("private, max-age=31536000, immutable");
  expect(new Uint8Array(await response.arrayBuffer())).toEqual(BYTES);
});

it("will not let the type be guessed from the bytes", async () => {
  expect((await serveRecording(askFor(), KEY)).headers.get("X-Content-Type-Options")).toBe("nosniff");
});

it("serves the part asked for, and says where it sits in the whole", async () => {
  const response = await serveRecording(askFor("bytes=2-4"), KEY);

  expect(response.status).toBe(206);
  expect(response.headers.get("Content-Range")).toBe("bytes 2-4/10");
  expect(response.headers.get("Content-Length")).toBe("3");
  expect(new Uint8Array(await response.arrayBuffer())).toEqual(new Uint8Array([2, 3, 4]));
});

it("serves from a point to the end, as a player does when it seeks", async () => {
  const response = await serveRecording(askFor("bytes=6-"), KEY);

  expect(response.status).toBe(206);
  expect(response.headers.get("Content-Range")).toBe("bytes 6-9/10");
});

it("serves the last bytes of the file", async () => {
  const response = await serveRecording(askFor("bytes=-3"), KEY);

  expect(response.headers.get("Content-Range")).toBe("bytes 7-9/10");
});

it("answers 416 for a range past the end of the file, and for one that makes no sense", async () => {
  expect((await serveRecording(askFor("bytes=50-60"), KEY)).status).toBe(416);
  expect((await serveRecording(askFor("bytes=9-0"), KEY)).status).toBe(416);
});

it("answers 404 where there is no such recording", async () => {
  expect((await serveRecording(askFor(), "ko/female-normal/0000000000000000.mp3")).status).toBe(404);
});
