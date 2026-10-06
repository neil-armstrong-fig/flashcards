import {failed, noteRemoved} from "@src/redux/slices/deck/DeckSlice";
import {cardsOfNote} from "@flashcards/content/cards/CardsOfNote";
import {clearMemoryAidsOfCards} from "@src/redux/shared/memory-aids/actions/memory-aid/thunks/ClearMemoryAidsOfCards";
import {cardsRemoved} from "@src/redux/slices/study/StudySlice";
import {isCustomNoteId} from "@src/redux/slices/deck/ids/CustomNoteId";
import {noteCleared} from "@src/redux/slices/similar/SimilarSlice";
import {selectNoteById} from "@src/redux/slices/deck/selectors/SelectNoteById";
import type {AppThunk} from "@src/redux/shared/AppThunk";
import {removeKeptNote} from "@src/redux/api/RemoveKeptNote";

/**
 * Deletes a card the learner made, online and then here, so what is shown is never ahead of what is kept: both of its directions,
 * the similar words kept with it and any note or picture on its cards go. The deck's own cards are not the learner's to delete, and are refused. Needs someone
 * signed in. Resolves to whether the card was deleted.
 */
export function removeCustomNote(noteId: string): AppThunk<Promise<boolean>> {
  return async (dispatch, getState) => {
    const note = selectNoteById(getState(), noteId);

    if (!note || !isCustomNoteId(noteId) || getState().account.status !== "signedIn") {
      return false;
    }

    try {
      await removeKeptNote(noteId);
    } catch (error) {
      console.error("A card could not be deleted.", error);
      dispatch(failed("Could not delete that. Check your connection and try again."));

      return false;
    }

    dispatch(noteRemoved(noteId));
    dispatch(noteCleared(noteId));
    const cardIds = cardsOfNote(note).map(card => card.id);

    dispatch(cardsRemoved(cardIds));
    await dispatch(clearMemoryAidsOfCards(cardIds));

    return true;
  };
}
