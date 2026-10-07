import {cardsAdded, cardsRemoved} from "@src/redux/slices/study/StudySlice";
import {cardsOfNote} from "@flashcards/content/cards/CardsOfNote";
import {clearMemoryAidsOfCards} from "@src/redux/shared/memory-aids/actions/memory-aid/thunks/ClearMemoryAidsOfCards";
import {isCustomNoteId} from "@src/redux/slices/deck/ids/CustomNoteId";
import {noteAdded, noteEdited, noteRemoved} from "@src/redux/slices/deck/DeckSlice";
import {noteCleared} from "@src/redux/slices/similar/SimilarSlice";
import {notePayloadOf} from "@flashcards/shared/sync/records/RecordChange";
import type {AppThunk} from "@src/redux/shared/AppThunk";
import type {RecordChange} from "@flashcards/shared/sync/records/RecordChange";
import type {VocabNote} from "@flashcards/content/types/VocabNote";

/**
 * Takes in a card the learner made or removed on another device: added, studied both ways, if it is new here, changed if its words
 * are, and, if it was removed, taken out with the similar words kept with it and any note or picture on its cards. Nothing is
 * recorded to send: the other device has told the API already.
 */
export function applyNoteRecord(change: RecordChange): AppThunk<Promise<void>> {
  return async (dispatch, getState) => {
    const here = getState().deck.notes.find(note => note.id === change.id);

    if (change.deleted) {
      if (here && isCustomNoteId(here.id)) {
        const cardIds = cardsOfNote(here).map(card => card.id);

        dispatch(noteRemoved(here.id));
        dispatch(noteCleared(here.id));
        dispatch(cardsRemoved(cardIds));
        await dispatch(clearMemoryAidsOfCards(cardIds, false));
      }

      return;
    }

    const words = notePayloadOf(change);

    if (words === undefined || !isCustomNoteId(change.id)) {
      return;
    }

    const note: VocabNote = {id: change.id, language: "ko", ...words};

    if (!here) {
      dispatch(noteAdded(note));
      dispatch(cardsAdded({ids: cardsOfNote(note).map(card => card.id), now: new Date().toISOString()}));

      return;
    }

    if (here.word !== note.word || here.meaning !== note.meaning || here.romanisation !== note.romanisation) {
      dispatch(noteEdited(note));
    }
  };
}
