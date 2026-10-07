/** What the fake API answers to a sync. */
export interface FakeSyncAnswer {
  readonly cursor: number;
  readonly more: boolean;
  readonly events: unknown[];
  readonly settings: unknown[];
  readonly recordCursor: number;
  readonly moreRecords: boolean;
  readonly records: unknown[];
}
