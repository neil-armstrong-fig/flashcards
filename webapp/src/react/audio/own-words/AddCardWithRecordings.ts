import {addCustomNote} from "@src/redux/workflows/custom-note/thunks/AddCustomNote";
import {failed} from "@src/redux/slices/deck/DeckSlice";
import {keepAudio} from "@src/audio/kept/KeepAudio";
import {startCustomNote} from "@src/redux/slices/deck/actions/custom-note/thunks/StartCustomNote";
import type {AppDispatch} from "@src/redux/Store";
import type {CardWords} from "@src/redux/slices/deck/types/CardWords";

/**
 * Makes a card of the learner's own. All or nothing: the words are checked, the recordings of the Korean and the English are fetched and
 * kept, the card is kept online, and only then is it added, so the learner is never left with a card that cannot be played or that another
 * device cannot find. Needs someone signed in. Resolves to whether the card was added.
 */
export async function addCardWithRecordings(dispatch: AppDispatch, words: CardWords): Promise<boolean> {
  const checked = dispatch(startCustomNote(words));

  if (checked === undefined) {
    return false;
  }

  try {
    await keepAudio("ko", checked.word);
    await keepAudio("en", checked.meaning);
  } catch (error) {
    console.error("A card's recordings could not be fetched.", error);
    dispatch(failed("Could not get its recordings. Check your connection and try again."));

    return false;
  }

  return await dispatch(addCustomNote(checked));
}
