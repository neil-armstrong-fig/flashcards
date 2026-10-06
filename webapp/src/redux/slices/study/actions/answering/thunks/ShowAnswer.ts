import {answerShown} from "@src/redux/slices/study/StudySlice";
import type {AppThunk} from "@src/redux/shared/AppThunk";
import {previewIntervals} from "@src/spaced-repetition/scheduling/PreviewIntervals";

/** Turns the card over, and works out when it would come back for each rating so the buttons can say so. */
export function showAnswer(): AppThunk {
  return (dispatch, getState) => {
    const {session, cards} = getState().study;
    const id = session?.currentCardId;
    const cardState = id ? cards[id] : undefined;

    if (!id || !cardState || session?.answerShown) {
      return;
    }

    const desiredRetention = getState().settings.desiredRetentionPercent / 100;

    dispatch(answerShown(previewIntervals({card: {id, state: cardState}, now: new Date(), desiredRetention})));
  };
}
