import {picturesLoaded} from "@src/redux/slices/card-pictures/CardPicturesSlice";
import type {AppThunk} from "@src/redux/shared/AppThunk";
import {loadStoredPictures} from "@src/redux/slices/card-pictures/storage/LoadStoredPictures";

/** Brings the pictures kept on this device into the store, once on start. A device that cannot be read is reported and carried on without. */
export function loadCardPictures(): AppThunk<Promise<void>> {
  return async (dispatch, _getState) => {
    try {
      dispatch(picturesLoaded(await loadStoredPictures()));
    } catch (error) {
      console.error("Could not read the pictures kept on this device.", error);
      dispatch(picturesLoaded({}));
    }
  };
}
