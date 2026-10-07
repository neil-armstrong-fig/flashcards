import type {RecordChange} from "@flashcards/shared/sync/records/RecordChange";
import type {SettingChange} from "@flashcards/shared/sync/settings/SettingChange";
import type {CardEvent} from "@flashcards/shared/sync/card-events/CardEvent";

/** What the API says to a sync: events after the cursor sent, the cursor to ask from next, and whether there are more to ask for. */
export interface SyncAnswer {
  readonly cursor: number;
  readonly more: boolean;
  readonly events: readonly CardEvent[];
  /** Every synced setting the account has chosen, as last chosen on any device. */
  readonly settings: readonly SettingChange[];
  /** Where to ask for records from next, and whether there are more to ask for. */
  readonly recordCursor: number;
  readonly moreRecords: boolean;
  /** What the learner made, changed or removed on any device since the cursor sent. */
  readonly records: readonly RecordChange[];
}
