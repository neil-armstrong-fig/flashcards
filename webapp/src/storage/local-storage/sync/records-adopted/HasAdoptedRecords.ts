import {readJson} from "@src/storage/local-storage/device/ReadJson";
import {RECORDS_ADOPTED_KEY} from "@src/storage/local-storage/sync/records-adopted/RecordsAdoptedKey";

/** Whether this device has made records of what it held before there were any. */
export function hasAdoptedRecords(): boolean {
  return readJson(RECORDS_ADOPTED_KEY) === true;
}
