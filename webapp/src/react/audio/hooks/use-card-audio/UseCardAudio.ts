import {useEffect, useEffectEvent, useRef} from "react";
import {useAppSelector} from "@src/redux/shared/Hooks";
import {useAudioChoices} from "@src/react/audio/hooks/use-audio-choices/UseAudioChoices";
import {useSpeakCard} from "@src/react/audio/hooks/use-speak-card/UseSpeakCard";

/**
 * Speaks the card on screen whenever the card, or which side of it, changes: the front when it comes up and the answer once shown, so
 * a learner can listen, think, and only then look. A card that comes straight back after "Again" changes side on the way, so it is
 * heard again. Changing the voice or speed does not speak: the switch does that. StrictMode runs an effect twice on mount in
 * development; the last thing spoken is kept in a ref, which survives that, so it is not said twice.
 */
export function useCardAudio(): void {
  const cardId = useAppSelector(state => state.study.session?.currentCardId);
  const answerShown = useAppSelector(state => state.study.session?.answerShown);
  const choices = useAudioChoices();
  const speakCard = useSpeakCard();
  const lastSpokenRef = useRef<string | undefined>(undefined);
  const speak = useEffectEvent((): void => speakCard(choices));
  const spokenKey = cardId ? `${cardId}:${String(answerShown)}` : undefined;

  useEffect(() => {
    if (spokenKey === lastSpokenRef.current) {
      return;
    }

    lastSpokenRef.current = spokenKey;

    if (spokenKey !== undefined) {
      speak();
    }
  }, [spokenKey]);
}
