import {cardsOfNote} from "@flashcards/content/cards/CardsOfNote";
import {cardsRemoved} from "@src/redux/slices/study/StudySlice";
import {clearMemoryAidsOfCards} from "@src/redux/shared/memory-aids/actions/memory-aid/thunks/ClearMemoryAidsOfCards";
import {isCustomNoteId} from "@src/redux/slices/deck/ids/CustomNoteId";
import {noteCleared} from "@src/redux/slices/similar/SimilarSlice";
import {noteRemoved} from "@src/redux/slices/deck/DeckSlice";
import {recordLocalChange} from "@src/redux/shared/sync-records/RecordLocalChange";
import {removalRecord} from "@src/redux/shared/sync-records/builders/RemovalRecord";
import {selectNoteById} from "@src/redux/slices/deck/selectors/SelectNoteById";
import {similarRecordId} from "@src/redux/shared/sync-records/builders/SimilarRecordId";
import type {AppThunk} from "@src/redux/shared/AppThunk";

/**
 * Deletes a card the learner made: both of its directions, the similar words kept with it and any note or picture on its cards go, and
 * the removals are recorded, as removals, so their other devices delete them too and nothing is brought back by a device that has not
 * heard yet. The deck's own cards are not the learner's to delete, and are refused. Resolves to whether the card was deleted.
 */
export function removeCustomNote(noteId: string): AppThunk<Promise<boolean>> {
  return async (dispatch, getState) => {
    const note = selectNoteById(getState(), noteId);

    if (!note || !isCustomNoteId(noteId)) {
      return false;
    }

    const now = new Date();
    const similars = getState().similar.words[noteId] ?? [];
    const cardIds = cardsOfNote(note).map(card => card.id);

    dispatch(noteRemoved(noteId));
    dispatch(noteCleared(noteId));
    dispatch(cardsRemoved(cardIds));
    await dispatch(recordLocalChange(removalRecord({kind: "note", id: noteId, at: now.toISOString()})));

    for (const text of similars) {
      await dispatch(
        recordLocalChange(removalRecord({kind: "similar", id: similarRecordId(noteId, text), at: now.toISOString()})),
      );
    }

    await dispatch(clearMemoryAidsOfCards(cardIds));

    return true;
  };
}
