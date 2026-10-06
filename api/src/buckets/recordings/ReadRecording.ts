import type {ByteRange} from "@language-learning/shared/http/types/ByteRange";
import {workerEnvironment} from "@src/env/WorkerEnvironment";
import type {RecordingsBucketOptions} from "@src/buckets/recordings/types/RecordingsBucketOptions";
import type {StoredRecording} from "@src/buckets/recordings/types/StoredRecording";

/** The recording under `key` in an R2 bucket, or just the part of it asked for, or `undefined` where there is none. */
export async function readRecording(key: string, range: ByteRange): Promise<StoredRecording | undefined> {
  try {
    return await read(key, range);
  } catch (error) {
    if (!isUnsatisfiableRange(error)) {
      throw error;
    }

    // R2 refuses a range that starts past the end of the object. For the caller that is a recording with nothing in that range.
    return {body: new Uint8Array(), size: 0, offset: 0, length: 0};
  }
}

async function read(key: string, range: ByteRange): Promise<StoredRecording | undefined> {
  const object = await workerEnvironment.RECORDINGS.get(key, optionsOf(range));

  if (object === null) {
    return undefined;
  }

  if (object.range === undefined) {
    return {body: object.body, size: object.size, offset: 0, length: object.size};
  }

  const offset = object.range.offset ?? object.size - (object.range.suffix ?? 0);
  const length = object.range.length ?? object.size - offset;

  return {body: object.body, size: object.size, offset, length};
}

function optionsOf(range: ByteRange): RecordingsBucketOptions | undefined {
  if (range.kind === "part") {
    return {range: {offset: range.offset, length: range.length}};
  }

  if (range.kind === "from") {
    return {range: {offset: range.offset}};
  }

  if (range.kind === "last") {
    return {range: {suffix: range.length}};
  }

  return undefined;
}

function isUnsatisfiableRange(error: unknown): boolean {
  return error instanceof Error && /range/i.test(error.message);
}
