/** A recording as the bucket hands it back: the bytes asked for, where they sit in the whole file, and how long the whole file is. */
export interface StoredRecording {
  readonly body: BodyInit;
  readonly size: number;
  readonly offset: number;
  readonly length: number;
}
