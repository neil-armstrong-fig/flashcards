import {useAppSelector} from "@src/redux/shared/Hooks";
import {useSwitchVoice} from "@src/react/audio/hooks/use-switch-voice/UseSwitchVoice";
import type {AudioChoices} from "@src/audio/types/AudioChoices";
import type {Voice} from "@language-learning/shared/audio/Voice";

const VOICE_LABELS = {female: "Female voice", male: "Male voice"} as const satisfies Record<Voice, string>;

interface Props {
  readonly testId: string;
  readonly className: string;
  /** What is said again after the switch, if anything, in the voice just chosen. */
  readonly replay?: (choices: AudioChoices) => void;
}

/** Says which voice is chosen and switches to the other, which speaks again so the two can be compared. */
export function VoiceSwitch({testId, className, replay}: Props): React.JSX.Element {
  const voice = useAppSelector(state => state.settings.voice);
  const switchVoice = useSwitchVoice(replay);

  return (
    <button type="button" data-testid={testId} onClick={switchVoice} className={className}>
      {VOICE_LABELS[voice]}
    </button>
  );
}
