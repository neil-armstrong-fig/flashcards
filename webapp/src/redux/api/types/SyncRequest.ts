import type {CardEvent} from "@flashcards/shared/sync/card-events/CardEvent";
import type {RecordChange} from "@flashcards/shared/sync/records/RecordChange";
import type {SettingChange} from "@flashcards/shared/sync/settings/SettingChange";

/** What this device tells the API when it syncs: how far it has read, and what it has done and chosen since. */
export interface SyncRequest {
  readonly cursor: number;
  readonly events: readonly CardEvent[];
  readonly settings: readonly SettingChange[];
  /** How far this device has read of the account's records. */
  readonly recordCursor: number;
  /** What the learner made, changed or removed here since it last sent. */
  readonly records: readonly RecordChange[];
}
