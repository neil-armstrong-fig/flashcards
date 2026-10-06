import {noteRemoved} from "@src/redux/slices/card-notes/CardNotesSlice";
import {pictureRemoved} from "@src/redux/slices/card-pictures/CardPicturesSlice";
import type {AppThunk} from "@src/redux/shared/AppThunk";
import {forgetStoredPicture} from "@src/redux/slices/card-pictures/storage/ForgetStoredPicture";

/** Forgets the notes and pictures on cards that no longer exist, here and on the device, so nothing is left behind by a deleted card. */
export function clearMemoryAidsOfCards(cardIds: readonly string[]): AppThunk<Promise<void>> {
  return async (dispatch, _getState) => {
    for (const cardId of cardIds) {
      dispatch(noteRemoved(cardId));
      dispatch(pictureRemoved(cardId));
      await forgetStoredPicture(cardId).catch((error: unknown) =>
        console.error("Could not forget the picture.", error),
      );
    }
  };
}
