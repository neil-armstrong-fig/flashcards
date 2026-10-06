import {addSimilarWord} from "@src/redux/slices/similar/actions/similar-word/thunks/AddSimilarWord";
import {startSimilarWord} from "@src/redux/slices/similar/actions/similar-word/thunks/StartSimilarWord";
import type {AppStore} from "@src/redux/Store";

/** Adds a similar word in the store, as the app does but without fetching any recording, for a test that is about something else. */
export async function addedSimilarWord(store: AppStore, noteId: string, text: string): Promise<boolean> {
  const word = store.dispatch(startSimilarWord(noteId, text));

  if (word === undefined) {
    return false;
  }

  return await store.dispatch(addSimilarWord(noteId, word));
}
