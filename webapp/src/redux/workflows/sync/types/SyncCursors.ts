/** How far this device has read of what the API keeps for the account: the card events and the records (what the learner made) are counted apart. */
export interface SyncCursors {
  readonly events: number;
  readonly records: number;
}
