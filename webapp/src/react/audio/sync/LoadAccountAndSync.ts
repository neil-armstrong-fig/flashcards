import {loadAccount} from "@src/redux/slices/account/actions/sign-in/thunks/LoadAccount";
import {syncKeptNotes} from "@src/react/audio/sync/SyncKeptNotes";
import {syncKeptSimilar} from "@src/react/audio/sync/SyncKeptSimilar";
import type {AppStore} from "@src/redux/Store";

/** Asks who is signed in and, if someone is, brings down what is kept for them online: their cards, their similar words, and the recordings of both. */
export async function loadAccountAndSync(store: AppStore): Promise<void> {
  await store.dispatch(loadAccount());

  if (store.getState().account.status !== "signedIn") {
    return;
  }

  await syncKeptNotes(store);
  await syncKeptSimilar(store);
}
