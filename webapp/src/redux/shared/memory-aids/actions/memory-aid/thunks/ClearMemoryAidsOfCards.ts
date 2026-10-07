import {noteRemoved} from "@src/redux/slices/card-notes/CardNotesSlice";
import {pictureRemoved} from "@src/redux/slices/card-pictures/CardPicturesSlice";
import {recordLocalChange} from "@src/redux/shared/sync-records/RecordLocalChange";
import {removalRecord} from "@src/redux/shared/sync-records/builders/RemovalRecord";
import type {AppThunk} from "@src/redux/shared/AppThunk";
import {forgetStoredPicture} from "@src/redux/slices/card-pictures/storage/ForgetStoredPicture";

/**
 * Forgets the notes and pictures on cards that no longer exist, here and on the device, so nothing is left behind by a deleted card.
 * `recorded` says whether to record the removals for the learner's other devices: a card deleted here does, a card a removal reached
 * from another device does not, since that device has done it already.
 */
export function clearMemoryAidsOfCards(cardIds: readonly string[], recorded = true): AppThunk<Promise<void>> {
  return async (dispatch, getState) => {
    const now = new Date();

    for (const cardId of cardIds) {
      const hadANote = getState().cardNotes.byCard[cardId] !== undefined;
      const hadAPicture = getState().cardPictures.byCard[cardId] !== undefined;

      dispatch(noteRemoved(cardId));
      dispatch(pictureRemoved(cardId));
      await forgetStoredPicture(cardId).catch((error: unknown) =>
        console.error("Could not forget the picture.", error),
      );

      if (recorded && hadANote) {
        await dispatch(recordLocalChange(removalRecord({kind: "memory-note", id: cardId, at: now.toISOString()})));
      }

      if (recorded && hadAPicture) {
        await dispatch(recordLocalChange(removalRecord({kind: "picture", id: cardId, at: now.toISOString()})));
      }
    }
  };
}
