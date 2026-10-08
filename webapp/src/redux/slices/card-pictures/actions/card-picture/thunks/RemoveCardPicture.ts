import {pictureRemoved} from "@src/redux/slices/card-pictures/CardPicturesSlice";
import {recordLocalChange} from "@src/redux/shared/sync-records/RecordLocalChange";
import {removalRecord} from "@src/redux/shared/sync-records/builders/RemovalRecord";
import type {AppThunk} from "@src/redux/shared/AppThunk";
import {forgetStoredPicture} from "@src/storage/index-db/pictures/ForgetStoredPicture";

/** Takes the picture off the card now on screen, and records that it was taken off, so the learner's other devices take it off too. */
export function removeCardPicture(): AppThunk<Promise<void>> {
  return async (dispatch, getState) => {
    const cardId = getState().study.session?.currentCardId;

    if (cardId === undefined) {
      return;
    }

    const hadOne = getState().cardPictures.byCard[cardId] !== undefined;

    await forgetStoredPicture(cardId).catch((error: unknown) => console.error("Could not forget the picture.", error));
    dispatch(pictureRemoved(cardId));

    if (hadOne) {
      await dispatch(recordLocalChange(removalRecord({kind: "picture", id: cardId, at: new Date().toISOString()})));
    }
  };
}
