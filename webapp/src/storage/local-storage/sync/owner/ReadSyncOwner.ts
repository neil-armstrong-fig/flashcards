import {readJson} from "@src/storage/local-storage/device/ReadJson";
import {SYNC_OWNER_KEY} from "@src/storage/local-storage/sync/owner/SyncOwnerKey";

/** Whose progress this device holds: the account that first synced it. `undefined` before any has. */
export function readSyncOwner(): string | undefined {
  const stored = readJson(SYNC_OWNER_KEY);

  if (typeof stored !== "string" || stored === "") {
    return undefined;
  }

  return stored;
}
