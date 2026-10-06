import {listenOnlyChosen} from "@src/redux/slices/settings/SettingsSlice";
import {ToggleSetting} from "@src/react/pages/settings/components/toggle-setting/ToggleSetting";
import {useAppDispatch, useAppSelector} from "@src/redux/shared/Hooks";

/** Whether the Korean word is kept off the front of a card until the answer is shown. */
export function ListenOnlySetting(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const checked = useAppSelector(state => state.settings.listenOnly);

  return (
    <ToggleSetting
      label="Listen without reading"
      description="Keep the Korean word off the front of the card until you show the answer."
      testId="listen-only"
      checked={checked}
      onChange={on => dispatch(listenOnlyChosen(on))}
    />
  );
}
