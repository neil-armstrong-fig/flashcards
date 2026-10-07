import {deckSpeedChosen} from "@src/redux/slices/settings/SettingsSlice";
import {ChoiceSetting} from "@src/react/components/choice-setting/ChoiceSetting";
import {selectDeckPreferences} from "@src/redux/slices/settings/selectors/SelectDeckPreferences";
import {SPEEDS} from "@flashcards/shared/audio/Speed";
import {useAppDispatch, useAppSelector} from "@src/redux/shared/Hooks";
import type {Speed} from "@flashcards/shared/audio/Speed";

const SPEED_LABELS = {normal: "Normal", slower: "Slower"} as const satisfies Record<Speed, string>;

interface Props {
  readonly deckId: string;
}

/** How fast a deck's words are spoken when it is studied. */
export function DeckSpeedSetting({deckId}: Props): React.JSX.Element {
  const dispatch = useAppDispatch();
  const {speed} = useAppSelector(state => selectDeckPreferences(state, deckId));

  return (
    <ChoiceSetting
      label="Speed"
      choices={SPEEDS}
      labels={SPEED_LABELS}
      testIdPrefix={`deck-speed-${deckId}`}
      value={speed}
      onChange={chosen => dispatch(deckSpeedChosen({deckId, speed: chosen}))}
    />
  );
}
