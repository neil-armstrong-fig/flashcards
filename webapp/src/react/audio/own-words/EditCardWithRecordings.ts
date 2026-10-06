import {editCustomNote} from "@src/redux/slices/deck/actions/custom-note/thunks/EditCustomNote";
import {editFailed} from "@src/redux/slices/deck/DeckSlice";
import {keepAudio} from "@src/audio/kept/KeepAudio";
import {startEditCustomNote} from "@src/redux/slices/deck/actions/custom-note/thunks/StartEditCustomNote";
import type {AppDispatch} from "@src/redux/Store";
import type {CardWords} from "@src/redux/slices/deck/types/CardWords";

/**
 * Changes the words of a card the learner made, all or nothing as making one is: the words are checked, the recordings of whatever changed
 * are fetched and kept, the card is changed online, and only then here. Needs someone signed in. Resolves to whether the card was changed.
 */
export async function editCardWithRecordings(
  dispatch: AppDispatch,
  noteId: string,
  words: CardWords,
): Promise<boolean> {
  const started = dispatch(startEditCustomNote(noteId, words));

  if (started === undefined) {
    return false;
  }

  const {words: checked, previous} = started;

  try {
    if (checked.word !== previous.word) {
      await keepAudio("ko", checked.word);
    }
    if (checked.meaning !== previous.meaning) {
      await keepAudio("en", checked.meaning);
    }
  } catch (error) {
    console.error("A card's recordings could not be fetched.", error);
    dispatch(editFailed("Could not get its recordings. Check your connection and try again."));

    return false;
  }

  return await dispatch(editCustomNote(noteId, checked));
}
