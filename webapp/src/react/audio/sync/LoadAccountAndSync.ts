import {loadAccount} from "@src/redux/slices/account/actions/sign-in/thunks/LoadAccount";
import {syncAndKeepRecordings} from "@src/react/audio/sync/SyncAndKeepRecordings";
import type {AppStore} from "@src/redux/Store";

/** Asks who is signed in and, if someone is, syncs with what is kept for them online: their progress, their cards, notes and pictures, and the recordings of their own words. */
export async function loadAccountAndSync(store: AppStore): Promise<void> {
  await store.dispatch(loadAccount());

  if (store.getState().account.status !== "signedIn") {
    return;
  }

  await syncAndKeepRecordings(store);
}
