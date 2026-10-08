import {clearStoredData} from "@src/redux/workflows/device/thunks/ClearStoredData";
import {forgetAllRecordings} from "@src/audio/recordings/ForgetAllRecordings";
import type {AppDispatch} from "@src/redux/Store";

/**
 * Removes everything this device keeps for the learner: what the app stores, and the recordings made ahead of time. Whatever has been
 * synced is fetched again once the page reloads; whatever has not is gone. The session is not ended: that is signing out.
 */
export async function clearThisDevice(dispatch: AppDispatch): Promise<void> {
  await dispatch(clearStoredData());
  await forgetAllRecordings();
}
