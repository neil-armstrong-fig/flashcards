import {previewAdvanced} from "@src/redux/slices/study/StudySlice";
import {queueSettingsOf} from "@src/redux/slices/study/queue/QueueSettingsOf";
import type {AppThunk} from "@src/redux/shared/AppThunk";

/** Moves on from the card in a look ahead. Nothing is rated, scheduled or written down: the card is only not shown again this time. */
export function nextPreviewCard(): AppThunk {
  return (dispatch, getState) => {
    const {session} = getState().study;

    if (session?.focus.kind !== "ahead" || !session.answerShown) {
      return;
    }

    dispatch(previewAdvanced(queueSettingsOf(getState().settings, session.deckId)));
  };
}
