import {saveJson} from "@src/storage/local-storage/device/SaveJson";
import {SYNC_CURSOR_KEY} from "@src/storage/local-storage/sync/cursors/SyncCursorKey";
import type {SyncCursors} from "@src/storage/local-storage/sync/cursors/types/SyncCursors";

/** Remembers how far this device has read for the account. */
export function keepSyncCursors(email: string, {events, records}: SyncCursors): void {
  saveJson(SYNC_CURSOR_KEY, {email, cursor: events, recordCursor: records});
}
