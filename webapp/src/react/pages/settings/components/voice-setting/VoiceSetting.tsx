import {voiceChosen} from "@src/redux/slices/settings/SettingsSlice";
import {ChoiceSetting} from "@src/react/pages/settings/components/choice-setting/ChoiceSetting";
import {VOICES} from "@language-learning/shared/audio/Voice";
import {useAppDispatch, useAppSelector} from "@src/redux/shared/Hooks";
import type {Voice} from "@language-learning/shared/audio/Voice";

const VOICE_LABELS = {female: "Female", male: "Male"} as const satisfies Record<Voice, string>;

/** Which voice speaks the Korean. */
export function VoiceSetting(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const value = useAppSelector(state => state.settings.voice);

  return (
    <ChoiceSetting
      label="Voice"
      choices={VOICES}
      labels={VOICE_LABELS}
      testIdPrefix="voice"
      value={value}
      onChange={chosen => dispatch(voiceChosen(chosen))}
    />
  );
}
