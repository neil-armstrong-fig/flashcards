import {addingFailed, addingStarted} from "@src/redux/slices/similar/SimilarSlice";
import {koreanWordFrom} from "@language-learning/shared/language/KoreanText";
import {similarOf} from "@src/redux/slices/similar/similars/SimilarOf";
import {selectNoteById} from "@src/redux/slices/deck/selectors/SelectNoteById";
import type {AppThunk} from "@src/redux/shared/AppThunk";

/**
 * Begins asking for a word the learner mistakes a word for: checks it (the API checks it again) and marks the word as being added.
 * Resolves to the word as checked, to be given to `addSimilarWord` once its recordings are kept; or to nothing, with the reason on the
 * state, when nobody is signed in, one is already being added, or the word is refused.
 */
export function startSimilarWord(noteId: string, text: string): AppThunk<string | undefined> {
  return (dispatch, getState) => {
    const similar = similarOf(selectNoteById(getState(), noteId), getState().similar.words[noteId]);

    if (!similar || getState().similar.adding || getState().account.status !== "signedIn") {
      return undefined;
    }

    const word = koreanWordFrom(text);

    if (word === undefined) {
      dispatch(addingFailed("Type a Korean word, up to twelve characters."));

      return undefined;
    }

    if (word === similar.own || similar.words.includes(word)) {
      dispatch(addingFailed("That one is already here."));

      return undefined;
    }

    dispatch(addingStarted());

    return word;
  };
}
