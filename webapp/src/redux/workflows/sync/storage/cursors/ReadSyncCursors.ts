import {readJson} from "@src/redux/shared/device-storage/ReadJson";
import {SYNC_CURSOR_KEY} from "@src/redux/workflows/sync/storage/cursors/SyncCursorKey";
import type {SyncCursors} from "@src/redux/workflows/sync/types/SyncCursors";

/** How far this device has read for that account: the cursors are the API's counts, so another account starts again from nothing. */
export function readSyncCursors(email: string): SyncCursors {
  const stored = readJson(SYNC_CURSOR_KEY);

  if (typeof stored !== "object" || stored === null) {
    return {events: 0, records: 0};
  }

  const {email: storedEmail, cursor, recordCursor} = stored as Record<string, unknown>;

  if (storedEmail !== email) {
    return {events: 0, records: 0};
  }

  return {events: wholeNumber(cursor), records: wholeNumber(recordCursor)};
}

function wholeNumber(value: unknown): number {
  if (typeof value !== "number" || !Number.isInteger(value) || value < 0) {
    return 0;
  }

  return value;
}
