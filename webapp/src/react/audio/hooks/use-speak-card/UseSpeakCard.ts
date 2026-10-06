import {useCallback} from "react";
import {selectKeptTexts} from "@src/redux/shared/kept-texts/SelectKeptTexts";
import {selectSpokenOnScreen} from "@src/redux/slices/deck/selectors/SelectSpokenOnScreen";
import {speakText} from "@src/audio/speak/SpeakText";
import {useAppSelector} from "@src/redux/shared/Hooks";
import type {AudioChoices} from "@src/audio/types/AudioChoices";

/**
 * Speaks what is on the card on screen now: its front while the answer is hidden, its answer once shown. The choices are handed in,
 * so a switch can speak again in the voice it has only just chosen. Says nothing when no card is up.
 */
export function useSpeakCard(): (choices: AudioChoices) => void {
  const spoken = useAppSelector(selectSpokenOnScreen);
  const kept = useAppSelector(selectKeptTexts);

  return useCallback(
    (choices: AudioChoices): void => {
      if (!spoken) {
        return;
      }

      speakText(kept, spoken, choices);
    },
    [spoken, kept],
  );
}
