import {keepRecordingsOfOwnWords} from "@src/react/audio/sync/KeepRecordingsOfOwnWords";
import {syncProgress} from "@src/redux/workflows/sync/thunks/SyncProgress";
import type {AppStore} from "@src/redux/Store";

/** Syncs what the learner has done and made with the API, then fetches the recordings of any of their own words that came with it. */
export async function syncAndKeepRecordings(store: AppStore): Promise<void> {
  await store.dispatch(syncProgress());

  if (store.getState().account.status === "signedIn") {
    await keepRecordingsOfOwnWords(store);
  }
}
