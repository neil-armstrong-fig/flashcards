import {hashOfPicture} from "@src/redux/slices/card-pictures/picture-processing/HashOfPicture";
import {isPictureType} from "@flashcards/shared/sync/records/PictureType";
import {memoryNoteRecord} from "@src/redux/shared/sync-records/builders/MemoryNoteRecord";
import {noteRenewed} from "@src/redux/slices/card-notes/CardNotesSlice";
import {pictureRecord} from "@src/redux/shared/sync-records/builders/PictureRecord";
import {pictureRenewed} from "@src/redux/slices/card-pictures/CardPicturesSlice";
import {recordLocalChange} from "@src/redux/shared/sync-records/RecordLocalChange";
import type {AppThunk} from "@src/redux/shared/AppThunk";
import {renewStoredPicture} from "@src/storage/index-db/pictures/RenewStoredPicture";

/** Keeps the note and picture on the card now on screen, and dates them afresh so the offer comes again after three more good answers. The new dates are recorded for the learner's other devices. */
export function keepMemoryAids(): AppThunk<Promise<void>> {
  return async (dispatch, getState) => {
    const cardId = getState().study.session?.currentCardId;

    if (cardId === undefined) {
      return;
    }

    const addedAt = new Date().toISOString();
    const text = getState().cardNotes.byCard[cardId];

    dispatch(noteRenewed({cardId, addedAt}));
    dispatch(pictureRenewed({cardId, addedAt}));

    if (text !== undefined) {
      await dispatch(recordLocalChange(memoryNoteRecord({cardId, text, at: addedAt})));
    }

    const picture = await renewStoredPicture(cardId, addedAt).catch((error: unknown) => {
      console.error("Could not renew the picture.", error);

      return undefined;
    });

    if (picture !== undefined && isPictureType(picture.type)) {
      await dispatch(
        recordLocalChange(pictureRecord({cardId, hash: await hashOfPicture(picture), type: picture.type, at: addedAt})),
      );
    }
  };
}
