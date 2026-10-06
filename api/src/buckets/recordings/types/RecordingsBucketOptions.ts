import type {R2Range} from "@src/buckets/recordings/types/R2Range";

/** What a read of the bucket may ask for: part of an object rather than all of it. */
export interface RecordingsBucketOptions {
  readonly range?: R2Range;
}
