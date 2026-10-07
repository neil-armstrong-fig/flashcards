import {readJson} from "@src/redux/shared/device-storage/ReadJson";
import {SYNC_OWNER_KEY} from "@src/redux/workflows/sync/storage/owner/SyncOwnerKey";

/** Whose progress this device holds: the account that first synced it. `undefined` before any has. */
export function readSyncOwner(): string | undefined {
  const stored = readJson(SYNC_OWNER_KEY);

  if (typeof stored !== "string" || stored === "") {
    return undefined;
  }

  return stored;
}
