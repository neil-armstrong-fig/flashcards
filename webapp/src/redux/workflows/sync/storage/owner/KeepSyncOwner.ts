import {saveJson} from "@src/redux/shared/device-storage/SaveJson";
import {SYNC_OWNER_KEY} from "@src/redux/workflows/sync/storage/owner/SyncOwnerKey";

/** Remembers whose progress this device holds. */
export function keepSyncOwner(email: string): void {
  saveJson(SYNC_OWNER_KEY, email);
}
