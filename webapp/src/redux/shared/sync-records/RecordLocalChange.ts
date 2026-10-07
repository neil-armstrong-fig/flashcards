import {keepLocalRecord} from "@src/redux/shared/sync-records/KeepLocalRecord";
import {localChangeMade} from "@src/redux/slices/sync/SyncSlice";
import {reportUnsaved} from "@src/redux/slices/study/actions/shared/utils/ReportUnsaved";
import type {AppThunk} from "@src/redux/shared/AppThunk";
import type {RecordChange} from "@flashcards/shared/sync/records/RecordChange";

/**
 * Keeps a change the learner has made to something of theirs, to be sent to the API the next time it syncs, and tells the sync there
 * is something to send. A failure to keep it is reported and the learner carries on: what they did stays on the screen and on the device.
 */
export function recordLocalChange(change: RecordChange): AppThunk<Promise<void>> {
  return async dispatch => {
    await keepLocalRecord(change).catch(reportUnsaved);
    dispatch(localChangeMade());
  };
}
