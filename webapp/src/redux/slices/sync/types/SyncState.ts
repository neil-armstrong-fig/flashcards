import type {SyncStatus} from "@src/redux/slices/sync/types/SyncStatus";

export interface SyncState {
  readonly status: SyncStatus;
  /** How many changes the learner has made to what is kept online (their cards, notes, pictures) since the app opened: a reason to sync soon. */
  readonly localChanges: number;
}
