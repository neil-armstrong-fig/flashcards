import type {RecordChange} from "@flashcards/shared/sync/records/RecordChange";

/** A record as the server holds it: with the place it came in the account's history, which is what a device's record cursor counts. */
export interface StoredRecordChange {
  readonly seq: number;
  readonly record: RecordChange;
}
