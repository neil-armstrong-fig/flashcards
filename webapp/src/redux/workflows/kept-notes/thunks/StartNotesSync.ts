import {cardsOfNote} from "@language-learning/content/cards/CardsOfNote";
import {cardsRemoved} from "@src/redux/slices/study/StudySlice";
import {noteRemoved} from "@src/redux/slices/deck/DeckSlice";
import {noteCleared} from "@src/redux/slices/similar/SimilarSlice";
import type {AppThunk} from "@src/redux/shared/AppThunk";
import type {KeptNote} from "@src/redux/slices/account/types/KeptNote";
import {readKeptNotes} from "@src/redux/api/ReadKeptNotes";

/**
 * Begins making the cards on this device the cards kept online, which are the truth: a card here that the API no longer has is dropped,
 * as is the similar words with it. Resolves to the cards kept online, each to be given to `syncKeptNote` once its recordings are on this
 * device; or to nothing, changing nothing, when the API cannot be reached.
 */
export function startNotesSync(): AppThunk<Promise<readonly KeptNote[] | undefined>> {
  return async (dispatch, getState) => {
    let kept: readonly KeptNote[];

    try {
      kept = await readKeptNotes();
    } catch (error) {
      console.error("The kept cards could not be read.", error);

      return undefined;
    }

    for (const note of getState().deck.notes) {
      if (!kept.some(each => each.id === note.id)) {
        dispatch(noteRemoved(note.id));
        dispatch(noteCleared(note.id));
        dispatch(cardsRemoved(cardsOfNote(note).map(card => card.id)));
      }
    }

    return kept;
  };
}
