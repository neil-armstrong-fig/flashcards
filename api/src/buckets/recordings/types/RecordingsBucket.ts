import type {BucketRecording} from "@src/buckets/recordings/types/BucketRecording";
import type {RecordingsBucketOptions} from "@src/buckets/recordings/types/RecordingsBucketOptions";

/** The part of an R2 bucket the Worker uses, so a test can stand in for it without building R2's whole object type. */
export interface RecordingsBucket {
  get(key: string, options?: RecordingsBucketOptions): Promise<BucketRecording | null>;
}
