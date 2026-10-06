import {addingFailed, wordAdded} from "@src/redux/slices/similar/SimilarSlice";
import type {AppThunk} from "@src/redux/shared/AppThunk";
import {addKeptSimilar} from "@src/redux/api/AddKeptSimilar";

/**
 * Keeps a word the learner mistakes a word for online with that word's note, and only then here. The word is the one `startSimilarWord`
 * checked, whose recordings are already kept. Resolves to whether the word was added.
 */
export function addSimilarWord(noteId: string, word: string): AppThunk<Promise<boolean>> {
  return async dispatch => {
    try {
      await addKeptSimilar(noteId, word);
    } catch (error) {
      console.error("A similar word could not be kept.", error);
      dispatch(addingFailed("Could not keep that word. Check your connection and try again."));

      return false;
    }

    dispatch(wordAdded({noteId, text: word}));

    return true;
  };
}
