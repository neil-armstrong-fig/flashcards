import {strugglingAfterChosen} from "@src/redux/slices/settings/SettingsSlice";
import {STRUGGLING_AFTER_LIMITS} from "@src/redux/slices/settings/limits/SettingLimits";
import {NumberSetting} from "@src/react/pages/settings/components/number-setting/NumberSetting";
import {useAppDispatch, useAppSelector} from "@src/redux/shared/Hooks";

/** How many times a card is forgotten before it counts as struggling. */
export function StrugglingAfterSetting(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const value = useAppSelector(state => state.settings.strugglingAfter);

  return (
    <NumberSetting
      label="Struggling after (times forgotten)"
      testId="struggling-after"
      value={value}
      min={STRUGGLING_AFTER_LIMITS.min}
      max={STRUGGLING_AFTER_LIMITS.max}
      onChange={chosen => dispatch(strugglingAfterChosen(chosen))}
    />
  );
}
