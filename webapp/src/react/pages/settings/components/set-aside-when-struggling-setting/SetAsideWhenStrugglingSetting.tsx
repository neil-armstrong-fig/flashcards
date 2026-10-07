import {setAsideWhenStrugglingChosen} from "@src/redux/slices/settings/SettingsSlice";
import {ToggleSetting} from "@src/react/components/toggle-setting/ToggleSetting";
import {useAppDispatch, useAppSelector} from "@src/redux/shared/Hooks";

/** Whether a card that counts as struggling is hidden from the reviews. */
export function SetAsideWhenStrugglingSetting(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const checked = useAppSelector(state => state.settings.setAsideWhenStruggling);

  return (
    <ToggleSetting
      label="Set struggling cards aside"
      description="Hide a card from your reviews as soon as it counts as struggling. It stays on the Struggling list."
      testId="set-aside-when-struggling"
      checked={checked}
      onChange={on => dispatch(setAsideWhenStrugglingChosen(on))}
    />
  );
}
