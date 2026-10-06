import {ACCOUNT_STORAGE_KEY} from "@src/redux/slices/account/storage/AccountStorageKey";
import {readJson} from "@src/redux/shared/device-storage/ReadJson";
import type {AccountState} from "@src/redux/slices/account/types/AccountState";

/** Who was signed in on this device last time, as far as the API could say: what is stored is untrusted, and anything odd is nobody. */
export function loadRememberedAccount(): AccountState {
  const stored = readJson(ACCOUNT_STORAGE_KEY);

  if (
    typeof stored !== "object" ||
    stored === null ||
    !("email" in stored) ||
    typeof stored.email !== "string" ||
    stored.email === ""
  ) {
    return {status: "unknown"};
  }

  return {status: "unknown", email: stored.email};
}
