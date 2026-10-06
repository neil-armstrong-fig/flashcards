import {addingFailed, wordRemoved} from "@src/redux/slices/similar/SimilarSlice";
import {similarOf} from "@src/redux/slices/similar/similars/SimilarOf";
import {selectNoteById} from "@src/redux/slices/deck/selectors/SelectNoteById";
import type {AppThunk} from "@src/redux/shared/AppThunk";
import {removeKeptSimilar} from "@src/redux/api/RemoveKeptSimilar";

/**
 * Deletes a similar the learner asked for, online and then here, so what is shown is never ahead of what is kept. The ones that
 * ship with a word are not the learner's to delete, and are refused. Resolves to whether the word was removed.
 */
export function removeSimilarWord(noteId: string, text: string): AppThunk<Promise<boolean>> {
  return async (dispatch, getState) => {
    const similar = similarOf(selectNoteById(getState(), noteId), getState().similar.words[noteId]);

    if (!similar?.learned.includes(text) || getState().account.status !== "signedIn") {
      return false;
    }

    try {
      await removeKeptSimilar(noteId, text);
    } catch (error) {
      console.error("A similar word could not be removed.", error);
      dispatch(addingFailed("Could not delete that. Check your connection and try again."));

      return false;
    }

    dispatch(wordRemoved({noteId, text}));

    return true;
  };
}
