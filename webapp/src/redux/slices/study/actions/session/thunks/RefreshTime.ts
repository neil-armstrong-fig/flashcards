import {timePassed} from "@src/redux/slices/study/StudySlice";
import type {AppThunk} from "@src/redux/shared/AppThunk";

/** Brings "now" up to date, so what is due is measured against the time it is and not the time the app was last touched. */
export function refreshTime(): AppThunk {
  return (dispatch, _getState) => {
    dispatch(timePassed(new Date().toISOString()));
  };
}
