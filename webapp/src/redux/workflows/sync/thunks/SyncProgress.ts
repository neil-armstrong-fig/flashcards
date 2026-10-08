import {forgetSentEvents} from "@src/storage/index-db/sync/events/ForgetSentEvents";
import {keepPulledEvents} from "@src/storage/index-db/sync/events/KeepPulledEvents";
import {untilNothingIsBeingSaved} from "@src/redux/workflows/sync/utils/UntilNothingIsBeingSaved";
import {keepSyncOwner} from "@src/storage/local-storage/sync/owner/KeepSyncOwner";
import {adoptLocalRecords} from "@src/redux/workflows/sync/thunks/AdoptLocalRecords";
import {applyPulledRecords} from "@src/redux/workflows/sync/thunks/ApplyPulledRecords";
import {forgetSentRecords} from "@src/storage/index-db/sync/records/ForgetSentRecords";
import {keepSyncCursors} from "@src/storage/local-storage/sync/cursors/KeepSyncCursors";
import {readSyncCursors} from "@src/storage/local-storage/sync/cursors/ReadSyncCursors";
import {readUnsentRecords} from "@src/storage/index-db/sync/records/ReadUnsentRecords";
import {uploadUnsentPictures} from "@src/redux/workflows/sync/utils/UploadUnsentPictures";
import {progressSynced} from "@src/redux/slices/study/StudySlice";
import {maySyncAs} from "@src/redux/workflows/sync/utils/MaySyncAs";
import {readSyncOwner} from "@src/storage/local-storage/sync/owner/ReadSyncOwner";
import {readUnsentEvents} from "@src/storage/index-db/sync/events/ReadUnsentEvents";
import {selectSignedInEmail} from "@src/redux/slices/account/selectors/SelectSignedInEmail";
import {keepSettingTimes} from "@src/redux/slices/settings/persistence/KeepSettingTimes";
import {readSettingTimes} from "@src/redux/slices/settings/persistence/ReadSettingTimes";
import {settingChangesToSend} from "@src/redux/slices/settings/sync/SettingChangesToSend";
import {settingsTaken} from "@src/redux/slices/settings/SettingsSlice";
import {takeLaterSettings} from "@src/redux/slices/settings/sync/TakeLaterSettings";
import {syncFailed, syncFinished, syncStarted} from "@src/redux/slices/sync/SyncSlice";
import {syncWithApi} from "@src/redux/api/sync-with-api/SyncWithApi";
import type {AppDispatch} from "@src/redux/Store";
import type {AppThunk} from "@src/redux/shared/AppThunk";
import type {SettingChange} from "@flashcards/shared/sync/settings/SettingChange";

/** The most events, and the most records, sent in one go: what the API accepts. */
const PER_SYNC = 100;

/**
 * Sends the API what this device has done and made and takes in what the learner's other devices have, until neither has more: the cards
 * they touched are worked out again from their whole history, and what they made is taken in one thing at a time, the later change winning (`docs/sync.md`). Does nothing when nobody is signed in or a sync is
 * already under way. A failure is quiet: the status says so and the next sync tries again; the learner is never blocked.
 */
export function syncProgress(): AppThunk<Promise<void>> {
  return async (dispatch, getState) => {
    const email = selectSignedInEmail(getState());

    if (email === undefined || getState().sync.status === "syncing") {
      return;
    }

    if (!maySyncAs(readSyncOwner(), email)) {
      console.error("This device holds another account's progress, so it is not synced.");
      dispatch(syncFailed());

      return;
    }

    keepSyncOwner(email);
    dispatch(syncStarted());

    try {
      await dispatch(adoptLocalRecords());

      let cursors = readSyncCursors(email);
      let again = true;

      while (again) {
        const unsent = await readUnsentEvents(PER_SYNC);
        const unsentRecords = await readUnsentRecords(PER_SYNC);
        const settings = settingChangesToSend(getState().settings, readSettingTimes());

        await uploadUnsentPictures(unsentRecords);

        const answer = await syncWithApi({
          cursor: cursors.events,
          events: unsent,
          settings,
          recordCursor: cursors.records,
          records: unsentRecords,
        });

        takeSettings(dispatch, answer.settings);
        await untilNothingIsBeingSaved(getState);

        const progress = await keepPulledEvents(answer.events);

        if (Object.keys(progress.cards).length > 0) {
          dispatch(progressSynced(progress));
        }

        await dispatch(applyPulledRecords(answer.records));
        await forgetSentEvents(unsent);
        await forgetSentRecords(unsentRecords);
        cursors = {events: answer.cursor, records: answer.recordCursor};
        keepSyncCursors(email, cursors);
        again = answer.more || answer.moreRecords || unsent.length === PER_SYNC || unsentRecords.length === PER_SYNC;
      }

      dispatch(syncFinished());
    } catch (error) {
      console.error("The learner's progress could not be synced.", error);
      dispatch(syncFailed());
    }
  };
}

/** Takes in the settings another device chose later than this one's, keeping the time they were chosen rather than the moment they arrived. */
function takeSettings(dispatch: AppDispatch, incoming: readonly SettingChange[]): void {
  const {chosen, times} = takeLaterSettings(incoming, readSettingTimes());

  if (Object.keys(chosen).length === 0) {
    return;
  }

  dispatch(settingsTaken(chosen));
  keepSettingTimes(times);
}
