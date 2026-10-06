import {editFailed, editingStarted} from "@src/redux/slices/deck/DeckSlice";
import {checkedCardWords} from "@src/redux/slices/deck/words/CheckedCardWords";
import {isCustomNoteId} from "@src/redux/slices/deck/ids/CustomNoteId";
import {selectNoteById} from "@src/redux/slices/deck/selectors/SelectNoteById";
import {selectNotes} from "@src/redux/slices/deck/selectors/SelectNotes";
import type {AppThunk} from "@src/redux/shared/AppThunk";
import type {CardWords} from "@src/redux/slices/deck/types/CardWords";
import type {StartedEdit} from "@src/redux/slices/deck/types/StartedEdit";

/**
 * Begins changing the words of a card the learner made: checks them and marks the card as being changed. Resolves to the words as checked
 * and the card as it was, to be given to `editCustomNote` once the recordings of what changed are kept; or to nothing, with the reason on
 * the state, when the card is not theirs, nobody is signed in, one is already being worked on, or the words are refused.
 */
export function startEditCustomNote(noteId: string, words: CardWords): AppThunk<StartedEdit | undefined> {
  return (dispatch, getState) => {
    const previous = selectNoteById(getState(), noteId);

    if (!previous || !isCustomNoteId(noteId) || getState().deck.adding || getState().account.status !== "signedIn") {
      return undefined;
    }

    const checked = checkedCardWords(words, selectNotes(getState()), noteId);

    if (checked.kind === "refused") {
      dispatch(editFailed(checked.message));

      return undefined;
    }

    dispatch(editingStarted());

    return {words: {word: checked.word, meaning: checked.meaning, romanisation: checked.romanisation}, previous};
  };
}
