import {noteRemoved} from "@src/redux/slices/card-notes/CardNotesSlice";
import {recordLocalChange} from "@src/redux/shared/sync-records/RecordLocalChange";
import {removalRecord} from "@src/redux/shared/sync-records/builders/RemovalRecord";
import {removeCardPicture} from "@src/redux/slices/card-pictures/actions/card-picture/thunks/RemoveCardPicture";
import type {AppThunk} from "@src/redux/shared/AppThunk";

/** Takes the learner's note and picture off the card now on screen, because they have answered it well enough not to need them, and records that for their other devices. */
export function removeMemoryAids(): AppThunk<Promise<void>> {
  return async (dispatch, getState) => {
    const cardId = getState().study.session?.currentCardId;

    if (cardId === undefined) {
      return;
    }

    const hadANote = getState().cardNotes.byCard[cardId] !== undefined;

    dispatch(noteRemoved(cardId));

    if (hadANote) {
      await dispatch(recordLocalChange(removalRecord({kind: "memory-note", id: cardId, at: new Date().toISOString()})));
    }

    await dispatch(removeCardPicture());
  };
}
