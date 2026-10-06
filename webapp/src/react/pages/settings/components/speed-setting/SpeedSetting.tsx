import {speedChosen} from "@src/redux/slices/settings/SettingsSlice";
import {ChoiceSetting} from "@src/react/pages/settings/components/choice-setting/ChoiceSetting";
import {SPEEDS} from "@language-learning/shared/audio/Speed";
import {useAppDispatch, useAppSelector} from "@src/redux/shared/Hooks";
import type {Speed} from "@language-learning/shared/audio/Speed";

const SPEED_LABELS = {normal: "Normal", slower: "Slower"} as const satisfies Record<Speed, string>;

/** How fast the Korean is spoken. */
export function SpeedSetting(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const value = useAppSelector(state => state.settings.speed);

  return (
    <ChoiceSetting
      label="Speed"
      choices={SPEEDS}
      labels={SPEED_LABELS}
      testIdPrefix="speed"
      value={value}
      onChange={chosen => dispatch(speedChosen(chosen))}
    />
  );
}
