import {saveJson} from "@src/redux/shared/device-storage/SaveJson";
import {SYNC_CURSOR_KEY} from "@src/redux/workflows/sync/storage/cursors/SyncCursorKey";
import type {SyncCursors} from "@src/redux/workflows/sync/types/SyncCursors";

/** Remembers how far this device has read for the account. */
export function keepSyncCursors(email: string, {events, records}: SyncCursors): void {
  saveJson(SYNC_CURSOR_KEY, {email, cursor: events, recordCursor: records});
}
