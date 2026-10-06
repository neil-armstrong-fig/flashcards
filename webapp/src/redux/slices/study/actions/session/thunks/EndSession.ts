import {sessionEnded} from "@src/redux/slices/study/StudySlice";
import type {AppThunk} from "@src/redux/shared/AppThunk";

export function endSession(): AppThunk {
  return dispatch => {
    dispatch(sessionEnded());
  };
}
