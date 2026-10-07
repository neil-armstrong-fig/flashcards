import type {SettingChange} from "@flashcards/shared/sync/settings/SettingChange";
import type {RecordChange} from "@flashcards/shared/sync/records/RecordChange";
import type {CardEvent} from "@flashcards/shared/sync/card-events/CardEvent";

/** What a device sends to sync: how far it has read, and what it has done since it last sent. */
export interface SyncRequest {
  readonly cursor: number;
  readonly events: readonly CardEvent[];
  /** The synced settings this device has chosen, each with when. Absent from an older device, which is as none. */
  readonly settings: readonly SettingChange[];
  /** How far this device has read of the account's records, which count apart from the events. */
  readonly recordCursor: number;
  /** What the learner made, changed or removed on this device since it last sent. */
  readonly records: readonly RecordChange[];
}
