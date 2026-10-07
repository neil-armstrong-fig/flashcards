import {hashOfPicture} from "@src/redux/slices/card-pictures/storage/HashOfPicture";
import {isPictureType} from "@flashcards/shared/sync/records/PictureType";
import {MAXIMUM_PICTURE_BYTES} from "@src/redux/slices/card-pictures/limits/MaximumPictureBytes";
import {pictureKept, pictureRefused} from "@src/redux/slices/card-pictures/CardPicturesSlice";
import {pictureRecord} from "@src/redux/shared/sync-records/builders/PictureRecord";
import {processPicture} from "@src/redux/slices/card-pictures/picture-processing/ProcessPicture";
import {recordLocalChange} from "@src/redux/shared/sync-records/RecordLocalChange";
import {storePicture} from "@src/redux/slices/card-pictures/storage/StorePicture";
import type {AppThunk} from "@src/redux/shared/AppThunk";

/**
 * Puts a picture the learner chose or pasted on the card now on screen, if it is a picture of a sensible size. It is made small
 * first (`processPicture`), so what is kept, and sent online, is the small one; its hash names it online (`docs/sync.md`).
 */
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
      const {picture, refusal} = await processPicture(file);

      if (picture === undefined || !isPictureType(picture.type)) {
        dispatch(pictureRefused(refusal ?? "That file is not a picture."));
        return;
      }

      const addedAt = new Date().toISOString();

      dispatch(pictureKept({cardId, address: await storePicture(cardId, picture, addedAt), addedAt}));
      await dispatch(
        recordLocalChange(pictureRecord({cardId, hash: await hashOfPicture(picture), type: picture.type, at: addedAt})),
      );
    } catch (error) {
      console.error("Could not keep the picture.", error);
      dispatch(pictureRefused("That picture could not be kept on this device."));
    }
  };
}
