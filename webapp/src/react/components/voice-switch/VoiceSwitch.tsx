import {selectSpeechVoice} from "@src/redux/shared/speech/SelectSpeechVoice";
import {useAppSelector} from "@src/redux/shared/Hooks";
import {useSwitchVoice} from "@src/react/audio/hooks/use-switch-voice/UseSwitchVoice";
import type {AudioChoices} from "@src/audio/types/AudioChoices";
import type {Voice} from "@flashcards/shared/audio/Voice";

const VOICE_LABELS = {female: "Female voice", male: "Male voice"} as const satisfies Record<Voice, string>;

const CHOSEN_STYLES = {
  male: "bg-voice-male text-on-voice",
  female: "bg-voice-female text-on-voice",
} as const satisfies Record<Voice, string>;

interface Props {
  readonly testId: string;
  readonly className: string;
  /** What is said again after the switch, if anything, in the voice just chosen. */
  readonly replay?: (choices: AudioChoices) => void;
}

/** Shows both voices, male then female, each in its own colour, with the chosen one filled. Pressing it switches to the other, which speaks again so the two can be compared. */
export function VoiceSwitch({testId, className, replay}: Props): React.JSX.Element {
  const voice = useAppSelector(selectSpeechVoice);
  const switchVoice = useSwitchVoice(replay);

  return (
    <button
      type="button"
      data-testid={testId}
      aria-label={VOICE_LABELS[voice]}
      onClick={switchVoice}
      className={`${className} flex items-center justify-center gap-1`}
    >
      <span className={`flex-1 rounded-full px-3 py-1 ${voice === "male" ? CHOSEN_STYLES.male : "text-voice-male"}`}>
        Male
      </span>

      <span
        className={`flex-1 rounded-full px-3 py-1 ${voice === "female" ? CHOSEN_STYLES.female : "text-voice-female"}`}
      >
        Female
      </span>
    </button>
  );
}
