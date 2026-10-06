import {addingStarted, failed} from "@src/redux/slices/deck/DeckSlice";
import {checkedCardWords} from "@src/redux/slices/deck/words/CheckedCardWords";
import {selectNotes} from "@src/redux/slices/deck/selectors/SelectNotes";
import type {AppThunk} from "@src/redux/shared/AppThunk";
import type {CardWords} from "@src/redux/slices/deck/types/CardWords";

/**
 * Begins making a card of the learner's own: checks the words (a Korean word of up to twelve characters, an English meaning of up to forty,
 * how it is said) and marks the card as being made. Resolves to the words as checked, to be given to `addCustomNote` once their recordings
 * are kept; or to nothing, with the reason on the state, when nobody is signed in, one is already being made, or the words are refused.
 */
export function startCustomNote(words: CardWords): AppThunk<CardWords | undefined> {
  return (dispatch, getState) => {
    if (getState().deck.adding || getState().account.status !== "signedIn") {
      return undefined;
    }

    const checked = checkedCardWords(words, selectNotes(getState()), undefined);

    if (checked.kind === "refused") {
      dispatch(failed(checked.message));

      return undefined;
    }

    dispatch(addingStarted());

    return {word: checked.word, meaning: checked.meaning, romanisation: checked.romanisation};
  };
}
