import {signedIn, signedOut, unreachable} from "@src/redux/slices/account/AccountSlice";
import type {AppThunk} from "@src/redux/shared/AppThunk";
import {readSignedInEmail} from "@src/redux/api/ReadSignedInEmail";

/**
 * Asks the API who is signed in, once on start. Where the API cannot be
 * reached (offline, or not running) the learner is marked unreachable: a device that has signed in before stays open, any other is
 * shown that sign-in cannot be reached (`SelectAccess`).
 */
export function loadAccount(): AppThunk<Promise<void>> {
  return async (dispatch, _getState) => {
    let email: string | undefined;

    try {
      email = await readSignedInEmail();
    } catch (error) {
      console.error("The API could not be asked who is signed in.", error);
      dispatch(unreachable());

      return;
    }

    if (email === undefined) {
      dispatch(signedOut());

      return;
    }

    dispatch(signedIn(email));
  };
}
