import {speedChosen} from "@src/redux/slices/settings/SettingsSlice";
import {ChoiceSetting} from "@src/react/components/choice-setting/ChoiceSetting";
import {SPEEDS} from "@flashcards/shared/audio/Speed";
import {useAppDispatch, useAppSelector} from "@src/redux/shared/Hooks";
import type {Speed} from "@flashcards/shared/audio/Speed";

const SPEED_LABELS = {normal: "Normal", slower: "Slower"} as const satisfies Record<Speed, string>;

/** How fast the list of every card is spoken, where no one deck is being studied. Each deck has its own, above. */
export function SpeedSetting(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const value = useAppSelector(state => state.settings.speed);

  return (
    <ChoiceSetting
      label="Speed when browsing"
      choices={SPEEDS}
      labels={SPEED_LABELS}
      testIdPrefix="speed"
      value={value}
      onChange={chosen => dispatch(speedChosen(chosen))}
    />
  );
}
