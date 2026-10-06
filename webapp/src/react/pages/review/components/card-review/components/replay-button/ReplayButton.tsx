import {SpeakerIcon} from "@src/react/components/speaker-icon/SpeakerIcon";
import {useAudioChoices} from "@src/react/audio/hooks/use-audio-choices/UseAudioChoices";
import {useSpeakCard} from "@src/react/audio/hooks/use-speak-card/UseSpeakCard";

/** Plays the card's recording again, for a word that was not heard clearly. */
export function ReplayButton(): React.JSX.Element {
  const choices = useAudioChoices();
  const speakCard = useSpeakCard();

  return (
    <button
      type="button"
      data-testid="replay-audio"
      aria-label="Play the word again"
      onClick={() => speakCard(choices)}
      className="flex size-16 items-center justify-center self-center rounded-full bg-ground-raised text-accent"
    >
      <SpeakerIcon className="size-8" />
    </button>
  );
}
