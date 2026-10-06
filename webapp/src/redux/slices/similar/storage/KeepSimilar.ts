import {SIMILAR_STORAGE_KEY} from "@src/redux/slices/similar/storage/SimilarStorageKey";
import {saveJson} from "@src/redux/shared/device-storage/SaveJson";
import type {RootState} from "@src/redux/Store";
import type {Store, UnknownAction} from "@reduxjs/toolkit";

/** Writes the similar words to the device each time they change, and only then. Whether a fetch is under way is not kept. */
export function keepSimilar(store: Store<RootState, UnknownAction>): void {
  let kept = store.getState().similar.words;

  store.subscribe(() => {
    const {words} = store.getState().similar;

    if (words === kept) {
      return;
    }

    kept = words;
    saveJson(SIMILAR_STORAGE_KEY, {words});
  });
}
