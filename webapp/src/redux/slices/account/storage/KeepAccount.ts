import {ACCOUNT_STORAGE_KEY} from "@src/redux/slices/account/storage/AccountStorageKey";
import {saveJson} from "@src/redux/shared/device-storage/SaveJson";
import type {RootState} from "@src/redux/Store";
import type {Store, UnknownAction} from "@reduxjs/toolkit";

/** Writes who is signed in to the device each time that changes, and only then, so it can be remembered when the API cannot be reached. */
export function keepAccount(store: Store<RootState, UnknownAction>): void {
  let kept = store.getState().account.email;

  store.subscribe(() => {
    const {email} = store.getState().account;

    if (email === kept) {
      return;
    }

    kept = email;
    saveJson(ACCOUNT_STORAGE_KEY, {email});
  });
}
