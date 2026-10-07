import type {RecordChange} from "@flashcards/shared/sync/records/RecordChange";

/** A record the fake API keeps, with the place it came in: what a device's record cursor counts. */
export interface FakeStoredRecord {
  readonly seq: number;
  readonly record: RecordChange;
}
