import {pictureRemoved} from "@src/redux/slices/card-pictures/CardPicturesSlice";
import type {AppThunk} from "@src/redux/shared/AppThunk";
import {forgetStoredPicture} from "@src/redux/slices/card-pictures/storage/ForgetStoredPicture";

/** Takes the picture off the card now on screen. */
export function removeCardPicture(): AppThunk<Promise<void>> {
  return async (dispatch, getState) => {
    const cardId = getState().study.session?.currentCardId;

    if (cardId === undefined) {
      return;
    }

    await forgetStoredPicture(cardId).catch((error: unknown) => console.error("Could not forget the picture.", error));
    dispatch(pictureRemoved(cardId));
  };
}
