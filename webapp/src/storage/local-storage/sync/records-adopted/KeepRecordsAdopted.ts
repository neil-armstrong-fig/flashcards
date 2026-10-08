import {saveJson} from "@src/storage/local-storage/device/SaveJson";
import {RECORDS_ADOPTED_KEY} from "@src/storage/local-storage/sync/records-adopted/RecordsAdoptedKey";

/** Remembers that this device has made records of what it held before there were any. */
export function keepRecordsAdopted(): void {
  saveJson(RECORDS_ADOPTED_KEY, true);
}
