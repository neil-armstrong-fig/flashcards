import {queueSettingsOf} from "@src/redux/slices/study/queue/QueueSettingsOf";
import {sessionStarted} from "@src/redux/slices/study/StudySlice";
import type {StudyFocus} from "@language-learning/shared/study/StudyFocus";
import type {AppThunk} from "@src/redux/shared/AppThunk";

/** Starts a session on one deck: its cards only, within its own limits, and optionally only its new cards or only the ones the learner is struggling with. */
export function startSession(deckId: string, focus: StudyFocus = "all"): AppThunk {
  return (dispatch, getState) => {
    const {settings} = getState();

    dispatch(
      sessionStarted({
        deckId,
        focus: {kind: focus, strugglingAfter: settings.strugglingAfter},
        now: new Date().toISOString(),
        queueSettings: queueSettingsOf(settings, deckId),
      }),
    );
  };
}
