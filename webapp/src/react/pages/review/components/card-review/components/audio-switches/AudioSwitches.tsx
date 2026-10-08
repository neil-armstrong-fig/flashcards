import {SpeedSwitch} from "@src/react/components/speed-switch/SpeedSwitch";
import {VoiceSwitch} from "@src/react/components/voice-switch/VoiceSwitch";
import {deckOffersVoiceAndSpeed} from "@src/redux/slices/deck/selectors/DeckOffersVoiceAndSpeed";
import {selectSpokenOnScreen} from "@src/redux/slices/deck/selectors/SelectSpokenOnScreen";
import {useAppSelector} from "@src/redux/shared/Hooks";
import {useSpeakCard} from "@src/react/audio/hooks/use-speak-card/UseSpeakCard";

/**
 * Two switches under the replay button, for trying the other voice or speed when a first listen is not clear enough. Each
 * speaks the word again and keeps the choice. Only while a language is being spoken (English has the one voice) and in a deck that offers the choice.
 */
export function AudioSwitches(): React.JSX.Element | undefined {
  const spoken = useAppSelector(selectSpokenOnScreen);
  const offered = useAppSelector(state => deckOffersVoiceAndSpeed(state.study.session?.deckId));
  const speakCard = useSpeakCard();

  if (!offered || !spoken || spoken.language === "en") {
    return undefined;
  }

  return (
    <div className="flex justify-center gap-3 text-sm">
      <VoiceSwitch testId="switch-voice" replay={speakCard} className="rounded-full bg-ground-raised px-4 py-2" />

      <SpeedSwitch testId="switch-speed" replay={speakCard} className="rounded-full bg-ground-raised px-4 py-2" />
    </div>
  );
}
