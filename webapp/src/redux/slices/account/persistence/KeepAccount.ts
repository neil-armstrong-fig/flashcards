import {keepStoredAccount} from "@src/storage/local-storage/account/KeepStoredAccount";
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
    keepStoredAccount({email});
  });
}
