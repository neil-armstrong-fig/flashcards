/** Whether this device matches what is kept online: `syncing` while a sync is under way, `not-synced` before the first and after one that failed. */
export const SYNC_STATUSES = ["not-synced", "syncing", "synced"] as const;

export type SyncStatus = (typeof SYNC_STATUSES)[number];
