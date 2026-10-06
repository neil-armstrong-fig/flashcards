import type {AppThunk} from "@src/redux/shared/AppThunk";
import {redirectToSignIn} from "@src/redux/api/RedirectToSignIn";

/** Sends the learner to Google to sign in, which brings them back to this page signed in. */
export function signIn(): AppThunk {
  return (_dispatch, _getState) => {
    redirectToSignIn();
  };
}
