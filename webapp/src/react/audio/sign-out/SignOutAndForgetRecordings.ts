import {endApiSession} from "@src/redux/api/EndApiSession";
import {forgetAllRecordings} from "@src/audio/recordings/ForgetAllRecordings";
import {forgotten} from "@src/redux/slices/offline/OfflineSlice";
import {signedOut} from "@src/redux/slices/account/AccountSlice";
import type {AppDispatch} from "@src/redux/Store";

/**
 * Ends the session. What the learner made and their progress stay on this device, as they were; only adding more waits for signing in
 * again. The recordings made ahead of time do not: they are served to a signed-in learner only (`docs/online.md`), so they go with the
 * session and are fetched again after the next sign-in.
 */
export async function signOutAndForgetRecordings(dispatch: AppDispatch): Promise<void> {
  try {
    await endApiSession();
  } catch (error) {
    console.error("Signing out could not be completed.", error);

    return;
  }

  await forgetAllRecordings();
  dispatch(forgotten());
  dispatch(signedOut());
}
