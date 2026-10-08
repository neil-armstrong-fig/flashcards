import {useState} from "react";
import {clearThisDevice} from "@src/react/audio/clear-device/ClearThisDevice";
import {Dialog} from "@src/react/components/dialog/Dialog";
import {SettingsGroup} from "@src/react/pages/settings/components/settings-group/SettingsGroup";
import {useAppDispatch} from "@src/redux/shared/Hooks";

/**
 * Clears everything this device keeps (progress, the learner's own cards, settings, pictures and recordings), after asking, then reloads
 * so the app starts as if it had never been opened here. Still signed in: what was synced is fetched again. For testing, and for a
 * device that has got out of step.
 */
export function ClearThisDevice(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const [asking, setAsking] = useState(false);
  const [clearing, setClearing] = useState(false);

  async function clear(): Promise<void> {
    setClearing(true);
    await clearThisDevice(dispatch);
    window.location.reload();
  }

  return (
    <SettingsGroup title="This device">
      <button
        type="button"
        data-testid="clear-this-device"
        onClick={() => setAsking(true)}
        className="min-h-11 rounded-xl bg-ground-raised px-4 py-2 text-sm font-semibold"
      >
        Clear this device
      </button>

      <Dialog
        open={asking}
        label="Clear this device"
        testId="clear-this-device-dialog"
        onClose={() => setAsking(false)}
      >
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold">Clear this device?</h2>

          <p data-testid="clear-this-device-warning" className="text-sm">
            This removes everything kept on this device: your progress, your own cards, your settings, pictures and
            downloaded recordings. Anything not yet synced to your account is lost. You stay signed in, and what was
            synced is fetched again.
          </p>

          <button
            type="button"
            data-testid="confirm-clear-this-device"
            disabled={clearing}
            onClick={() => void clear()}
            className="min-h-12 rounded-xl bg-accent px-6 py-3 text-lg font-semibold text-ground disabled:opacity-50"
          >
            Clear this device
          </button>

          <button
            type="button"
            data-testid="cancel-clear-this-device"
            disabled={clearing}
            onClick={() => setAsking(false)}
            className="min-h-12 rounded-xl bg-ground px-6 py-3 text-lg font-semibold"
          >
            Cancel
          </button>
        </div>
      </Dialog>
    </SettingsGroup>
  );
}
