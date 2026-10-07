/** What a device sent to sync, as far as the fake API reads it. */
export interface FakeSyncBody {
  readonly cursor: number;
  readonly events: unknown[];
  readonly settings: unknown[];
  readonly recordCursor: number;
  readonly records: unknown[];
}
