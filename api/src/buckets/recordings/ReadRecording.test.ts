import {workerEnvironment} from "@src/env/WorkerEnvironment";
import {readRecording} from "@src/buckets/recordings/ReadRecording";
import type {RecordingsBucket} from "@src/buckets/recordings/types/RecordingsBucket";
import type {RecordingsBucketOptions} from "@src/buckets/recordings/types/RecordingsBucketOptions";

const BYTES = new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

/** A bucket holding one ten-byte object, answering a range the way R2 does: the bytes, the whole size and the range they are. */
class OneObjectBucket implements RecordingsBucket {
  asked: RecordingsBucketOptions | undefined;

  async get(key: string, options?: RecordingsBucketOptions): ReturnType<RecordingsBucket["get"]> {
    this.asked = options;

    if (key !== "here") {
      return null;
    }

    const range = options?.range;

    if (range?.suffix !== undefined) {
      const length = Math.min(range.suffix, BYTES.length);

      return {
        body: streamOf(BYTES.slice(BYTES.length - length)),
        size: BYTES.length,
        range: {offset: BYTES.length - length, length},
      };
    }

    if (range !== undefined) {
      const offset = range.offset ?? 0;
      const length = Math.min(range.length ?? BYTES.length - offset, BYTES.length - offset);

      return {body: streamOf(BYTES.slice(offset, offset + length)), size: BYTES.length, range: {offset, length}};
    }

    return {body: streamOf(BYTES), size: BYTES.length};
  }
}

function streamOf(bytes: Uint8Array): ReadableStream {
  return new Response(bytes).body ?? new ReadableStream();
}

it("reads the whole object when no range is asked for", async () => {
  const bucket = new OneObjectBucket();
  workerEnvironment.RECORDINGS = bucket;
  const stored = await readRecording("here", {kind: "whole"});

  expect(bucket.asked).toBeUndefined();
  expect(stored).toMatchObject({size: 10, offset: 0, length: 10});
});

it.each([
  ["a stretch", {kind: "part", offset: 2, length: 3} as const, {offset: 2, length: 3}, {offset: 2, length: 3}],
  ["from a point", {kind: "from", offset: 6} as const, {offset: 6}, {offset: 6, length: 4}],
  ["the last bytes", {kind: "last", length: 4} as const, {suffix: 4}, {offset: 6, length: 4}],
])("asks the bucket for %s and says where it sits", async (_name, range, asked, sits) => {
  const bucket = new OneObjectBucket();
  workerEnvironment.RECORDINGS = bucket;
  const stored = await readRecording("here", range);

  expect(bucket.asked).toEqual({range: asked});
  expect(stored).toMatchObject({size: 10, ...sits});
});

it("is undefined where the bucket has no such object", async () => {
  workerEnvironment.RECORDINGS = new OneObjectBucket();

  expect(await readRecording("gone", {kind: "whole"})).toBeUndefined();
});

it("treats a range the bucket cannot give as an empty one, which is a 416 for the caller to answer", async () => {
  workerEnvironment.RECORDINGS = {
    get: async () => {
      throw new Error("The requested range is not satisfiable");
    },
  };
  const stored = await readRecording("here", {kind: "part", offset: 50, length: 10});

  expect(stored).toMatchObject({length: 0});
});

it("lets any other failure of the bucket through, so it is a 500 and not a quiet empty answer", async () => {
  workerEnvironment.RECORDINGS = {
    get: async () => {
      throw new Error("The bucket is unavailable");
    },
  };

  await expect(readRecording("here", {kind: "part", offset: 0, length: 1})).rejects.toThrow("unavailable");
});
