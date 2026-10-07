import {desiredRetentionChosen} from "@src/redux/slices/settings/SettingsSlice";
import {DESIRED_RETENTION_PERCENT_LIMITS} from "@src/redux/slices/settings/limits/SettingLimits";
import {NumberSetting} from "@src/react/components/number-setting/NumberSetting";
import {useAppDispatch, useAppSelector} from "@src/redux/shared/Hooks";

/** How much of what is reviewed the learner wants to still remember. */
export function DesiredRetentionSetting(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const value = useAppSelector(state => state.settings.desiredRetentionPercent);

  return (
    <NumberSetting
      label="Cards to remember (percent)"
      testId="desired-retention"
      value={value}
      min={DESIRED_RETENTION_PERCENT_LIMITS.min}
      max={DESIRED_RETENTION_PERCENT_LIMITS.max}
      onChange={chosen => dispatch(desiredRetentionChosen(chosen))}
    />
  );
}
