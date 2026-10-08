import {deleteAllDatabases} from "@src/storage/index-db/device/DeleteAllDatabases";
import {removeAllKeys} from "@src/storage/local-storage/device/RemoveAllKeys";

/** Removes everything the app keeps on this device in localStorage and IndexedDB: as a device it had never been opened on. */
export async function clearAllStoredData(): Promise<void> {
  removeAllKeys();
  await deleteAllDatabases();
}
