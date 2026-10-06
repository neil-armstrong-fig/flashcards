import {noteWritten} from "@src/redux/slices/card-notes/CardNotesSlice";
import type {AppThunk} from "@src/redux/shared/AppThunk";

/** Writes the learner's note on the card now on screen, dated now so that fading counts the answers that follow. */
export function writeCardNote(text: string): AppThunk {
  return (dispatch, getState) => {
    const cardId = getState().study.session?.currentCardId;

    if (cardId === undefined) {
      return;
    }

    dispatch(noteWritten({cardId, text, addedAt: new Date().toISOString()}));
  };
}
