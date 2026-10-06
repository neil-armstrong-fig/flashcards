import {deckVoiceChosen} from "@src/redux/slices/settings/SettingsSlice";
import {ChoiceSetting} from "@src/react/pages/settings/components/choice-setting/ChoiceSetting";
import {selectDeckPreferences} from "@src/redux/slices/settings/selectors/SelectDeckPreferences";
import {VOICES} from "@flashcards/shared/audio/Voice";
import {useAppDispatch, useAppSelector} from "@src/redux/shared/Hooks";
import type {Voice} from "@flashcards/shared/audio/Voice";

const VOICE_LABELS = {male: "Male", female: "Female"} as const satisfies Record<Voice, string>;

interface Props {
  readonly deckId: string;
}

/** Which voice speaks a deck's words when it is studied, for the deck whose voice sounds odd to change alone. */
export function DeckVoiceSetting({deckId}: Props): React.JSX.Element {
  const dispatch = useAppDispatch();
  const {voice} = useAppSelector(state => selectDeckPreferences(state, deckId));

  return (
    <ChoiceSetting
      label="Voice"
      choices={VOICES}
      labels={VOICE_LABELS}
      testIdPrefix={`deck-voice-${deckId}`}
      value={voice}
      onChange={chosen => dispatch(deckVoiceChosen({deckId, voice: chosen}))}
    />
  );
}
