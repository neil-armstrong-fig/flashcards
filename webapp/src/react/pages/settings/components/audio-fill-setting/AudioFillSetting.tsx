import {audioFillEnabledChosen} from "@src/redux/slices/settings/SettingsSlice";
import {ToggleSetting} from "@src/react/components/toggle-setting/ToggleSetting";
import {useAppDispatch, useAppSelector} from "@src/redux/shared/Hooks";

/** Whether recording starts are shown with a wash of colour on this device. */
export function AudioFillSetting(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const checked = useAppSelector(state => state.settings.audioFillEnabled);

  return (
    <ToggleSetting
      label="Colour wash when audio plays"
      description="Briefly wash the screen or card with colour when a recording begins."
      testId="audio-fill-enabled"
      checked={checked}
      onChange={on => dispatch(audioFillEnabledChosen(on))}
    />
  );
}
