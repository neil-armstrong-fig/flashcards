import {applyReminder} from "@src/redux/slices/settings/actions/reminder/thunks/ApplyReminder";
import {canPush} from "@src/push/CanPush";
import {reminderEnabledChosen, reminderHourChosen} from "@src/redux/slices/settings/SettingsSlice";
import {ToggleSetting} from "@src/react/components/toggle-setting/ToggleSetting";
import {useAppDispatch, useAppSelector} from "@src/redux/shared/Hooks";

const HOURS = Array.from({length: 24}, (_, hour) => hour);

/** A reminder, pushed to this device, when the daily goal is not yet reached. Not shown where the browser cannot be pushed to. */
export function ReminderSetting(): React.JSX.Element | null {
  const dispatch = useAppDispatch();
  const enabled = useAppSelector(state => state.settings.reminderEnabled);
  const hour = useAppSelector(state => state.settings.reminderHour);

  if (!canPush()) {
    return null;
  }

  return (
    <>
      <ToggleSetting
        label="Remind me"
        description="A notification on this device if the daily goal is not reached by then."
        testId="reminder-enabled"
        checked={enabled}
        onChange={on => {
          dispatch(reminderEnabledChosen(on));
          void dispatch(applyReminder());
        }}
      />

      {enabled && (
        <label className="flex items-center justify-between gap-4 rounded-xl bg-ground-raised p-4">
          Remind me at
          <select
            data-testid="reminder-hour"
            value={hour}
            onChange={event => {
              dispatch(reminderHourChosen(Number(event.currentTarget.value)));
              void dispatch(applyReminder());
            }}
            className="min-h-11 rounded-lg bg-ground px-3 py-2"
          >
            {HOURS.map(option => (
              <option key={option} value={option}>
                {clockTime(option)}
              </option>
            ))}
          </select>
        </label>
      )}
    </>
  );
}

function clockTime(hour: number): string {
  return `${String(hour).padStart(2, "0")}:00`;
}
