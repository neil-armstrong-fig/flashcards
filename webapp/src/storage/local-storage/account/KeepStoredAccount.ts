import {saveJson} from "@src/storage/local-storage/device/SaveJson";
import {ACCOUNT_STORAGE_KEY} from "@src/storage/local-storage/account/AccountStorageKey";

/** Keeps who is signed in on this device. */
export function keepStoredAccount(stored: unknown): void {
  saveJson(ACCOUNT_STORAGE_KEY, stored);
}
