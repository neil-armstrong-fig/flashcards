import type {R2Range} from "@src/buckets/recordings/types/R2Range";

/** What the bucket hands back: the bytes it was asked for, the whole object's size and, where a range was asked for, the range it is. */
export interface BucketRecording {
  readonly body: ReadableStream;
  readonly size: number;
  readonly range?: R2Range;
}
