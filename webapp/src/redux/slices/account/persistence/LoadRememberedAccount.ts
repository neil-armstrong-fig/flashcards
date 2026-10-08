import {readStoredAccount} from "@src/storage/local-storage/account/ReadStoredAccount";
import type {AccountState} from "@src/redux/slices/account/types/AccountState";

/** Who was signed in on this device last time, as far as the API could say: what is stored is untrusted, and anything odd is nobody. */
export function loadRememberedAccount(): AccountState {
  const stored = readStoredAccount();

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
