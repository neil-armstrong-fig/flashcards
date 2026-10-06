import {noteRemoved} from "@src/redux/slices/card-notes/CardNotesSlice";
import {removeCardPicture} from "@src/redux/slices/card-pictures/actions/card-picture/thunks/RemoveCardPicture";
import type {AppThunk} from "@src/redux/shared/AppThunk";

/** Takes the learner's note and picture off the card now on screen, because they have answered it well enough not to need them. */
export function removeMemoryAids(): AppThunk<Promise<void>> {
  return async (dispatch, getState) => {
    const cardId = getState().study.session?.currentCardId;

    if (cardId === undefined) {
      return;
    }

    dispatch(noteRemoved(cardId));
    await dispatch(removeCardPicture());
  };
}
