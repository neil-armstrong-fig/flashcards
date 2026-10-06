import {MAXIMUM_PICTURE_BYTES} from "@src/redux/slices/card-pictures/limits/MaximumPictureBytes";
import {pictureKept, pictureRefused} from "@src/redux/slices/card-pictures/CardPicturesSlice";
import type {AppThunk} from "@src/redux/shared/AppThunk";
import {storePicture} from "@src/redux/slices/card-pictures/storage/StorePicture";

/** Puts a picture the learner chose or pasted on the card now on screen, if it is a picture of a sensible size. */
export function addCardPicture(file: File): AppThunk<Promise<void>> {
  return async (dispatch, getState) => {
    const cardId = getState().study.session?.currentCardId;

    if (cardId === undefined) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      dispatch(pictureRefused("That file is not a picture."));
      return;
    }

    if (file.size > MAXIMUM_PICTURE_BYTES) {
      dispatch(pictureRefused("That picture is too big: 5 MB at most."));
      return;
    }

    try {
      const addedAt = new Date().toISOString();

      dispatch(pictureKept({cardId, address: await storePicture(cardId, file, addedAt), addedAt}));
    } catch (error) {
      console.error("Could not keep the picture.", error);
      dispatch(pictureRefused("That picture could not be kept on this device."));
    }
  };
}
