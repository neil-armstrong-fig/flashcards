import {readPushKey} from "@src/redux/api/reminders/ReadPushKey";
import {removeReminder} from "@src/redux/api/reminders/RemoveReminder";
import {saveReminder} from "@src/redux/api/reminders/SaveReminder";
import {reminderEnabledChosen} from "@src/redux/slices/settings/SettingsSlice";
import {subscribeToPush} from "@src/push/SubscribeToPush";
import {unsubscribeFromPush} from "@src/push/UnsubscribeFromPush";
import type {AppThunk} from "@src/redux/shared/AppThunk";

/**
 * Makes the API's reminder for this device match the settings: subscribed and told the hour when it is on, unsubscribed and
 * forgotten when it is off. Where the learner will not allow notifications, or this browser cannot push, or the API cannot be
 * reached, the reminder is turned back off rather than left saying something that is not so.
 */
export function applyReminder(): AppThunk<Promise<void>> {
  return async (dispatch, getState) => {
    const {reminderEnabled, reminderHour} = getState().settings;

    try {
      if (!reminderEnabled) {
        const endpoint = await unsubscribeFromPush();

        if (endpoint !== undefined) {
          await removeReminder(endpoint);
        }

        return;
      }

      const endpoint = await subscribeToPush(await readPushKey());

      if (endpoint === undefined) {
        dispatch(reminderEnabledChosen(false));

        return;
      }

      await saveReminder({endpoint, hour: reminderHour, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone});
    } catch (error) {
      console.error("The reminder could not be set up.", error);

      if (reminderEnabled) {
        dispatch(reminderEnabledChosen(false));
      }
    }
  };
}
