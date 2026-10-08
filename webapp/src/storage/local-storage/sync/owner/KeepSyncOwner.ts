import {saveJson} from "@src/storage/local-storage/device/SaveJson";
import {SYNC_OWNER_KEY} from "@src/storage/local-storage/sync/owner/SyncOwnerKey";

/** Remembers whose progress this device holds. */
export function keepSyncOwner(email: string): void {
  saveJson(SYNC_OWNER_KEY, email);
}
