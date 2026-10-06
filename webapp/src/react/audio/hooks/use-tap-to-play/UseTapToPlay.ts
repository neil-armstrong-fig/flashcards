import type {MouseEvent} from "react";
import {isTapOnBackground} from "@src/react/audio/hooks/use-tap-to-play/is-tap-on-background/IsTapOnBackground";
import {useAudioChoices} from "@src/react/audio/hooks/use-audio-choices/UseAudioChoices";
import {useSpeakCard} from "@src/react/audio/hooks/use-speak-card/UseSpeakCard";

/** A click handler that speaks the card on screen, for a tap anywhere that is not a button, link or field. */
export function useTapToPlay(): (event: MouseEvent) => void {
  const choices = useAudioChoices();
  const speakCard = useSpeakCard();

  return function tapToPlay(event: MouseEvent): void {
    if (!isTapOnBackground(event)) {
      return;
    }

    speakCard(choices);
  };
}
