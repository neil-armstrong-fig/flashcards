import {readJson} from "@src/storage/local-storage/device/ReadJson";
import {ACCOUNT_STORAGE_KEY} from "@src/storage/local-storage/account/AccountStorageKey";

/** Who was signed in kept on this device, as `unknown` until the caller has checked it. */
export function readStoredAccount(): unknown {
  return readJson(ACCOUNT_STORAGE_KEY);
}
