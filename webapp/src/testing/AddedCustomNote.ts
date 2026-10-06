import {addCustomNote} from "@src/redux/workflows/custom-note/thunks/AddCustomNote";
import {startCustomNote} from "@src/redux/slices/deck/actions/custom-note/thunks/StartCustomNote";
import type {AppStore} from "@src/redux/Store";
import type {CardWords} from "@src/redux/slices/deck/types/CardWords";

/** Makes a card of the learner's own in the store, as the app does but without fetching any recording, for a test that is about something else. */
export async function addedCustomNote(store: AppStore, words: CardWords): Promise<boolean> {
  const checked = store.dispatch(startCustomNote(words));

  if (checked === undefined) {
    return false;
  }

  return await store.dispatch(addCustomNote(checked));
}
