import {noteRenewed} from "@src/redux/slices/card-notes/CardNotesSlice";
import {pictureRenewed} from "@src/redux/slices/card-pictures/CardPicturesSlice";
import type {AppThunk} from "@src/redux/shared/AppThunk";
import {renewStoredPicture} from "@src/redux/slices/card-pictures/storage/RenewStoredPicture";

/** Keeps the note and picture on the card now on screen, and dates them afresh so the offer comes again after three more good answers. */
export function keepMemoryAids(): AppThunk<Promise<void>> {
  return async (dispatch, getState) => {
    const cardId = getState().study.session?.currentCardId;

    if (cardId === undefined) {
      return;
    }

    const addedAt = new Date().toISOString();

    dispatch(noteRenewed({cardId, addedAt}));
    dispatch(pictureRenewed({cardId, addedAt}));
    await renewStoredPicture(cardId, addedAt).catch((error: unknown) =>
      console.error("Could not renew the picture.", error),
    );
  };
}
