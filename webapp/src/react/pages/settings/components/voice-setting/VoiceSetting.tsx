import {voiceChosen} from "@src/redux/slices/settings/SettingsSlice";
import {ChoiceSetting} from "@src/react/pages/settings/components/choice-setting/ChoiceSetting";
import {VOICES} from "@flashcards/shared/audio/Voice";
import {useAppDispatch, useAppSelector} from "@src/redux/shared/Hooks";
import type {Voice} from "@flashcards/shared/audio/Voice";

const VOICE_LABELS = {female: "Female", male: "Male"} as const satisfies Record<Voice, string>;

/** Which voice speaks the list of every card, where no one deck is being studied. Each deck has its own, above. */
export function VoiceSetting(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const value = useAppSelector(state => state.settings.voice);

  return (
    <ChoiceSetting
      label="Voice when browsing"
      choices={VOICES}
      labels={VOICE_LABELS}
      testIdPrefix="voice"
      value={value}
      onChange={chosen => dispatch(voiceChosen(chosen))}
    />
  );
}
