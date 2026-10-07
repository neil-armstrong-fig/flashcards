import {dailyGoalChosen} from "@src/redux/slices/settings/SettingsSlice";
import {DAILY_GOAL_CARDS_LIMITS} from "@src/redux/slices/settings/limits/SettingLimits";
import {NumberSetting} from "@src/react/components/number-setting/NumberSetting";
import {useAppDispatch, useAppSelector} from "@src/redux/shared/Hooks";

/** How many cards the learner aims to review each day. */
export function DailyGoalSetting(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const value = useAppSelector(state => state.settings.dailyGoalCards);

  return (
    <NumberSetting
      label="Daily goal (cards)"
      testId="daily-goal-input"
      value={value}
      min={DAILY_GOAL_CARDS_LIMITS.min}
      max={DAILY_GOAL_CARDS_LIMITS.max}
      onChange={chosen => dispatch(dailyGoalChosen(chosen))}
    />
  );
}
