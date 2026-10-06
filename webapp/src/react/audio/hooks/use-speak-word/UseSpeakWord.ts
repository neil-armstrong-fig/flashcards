import {useCallback} from "react";
import {selectKeptTexts} from "@src/redux/shared/kept-texts/SelectKeptTexts";
import {speakText} from "@src/audio/speak/SpeakText";
import {useAppSelector} from "@src/redux/shared/Hooks";
import type {AudioChoices} from "@src/audio/types/AudioChoices";
import type {SpokenText} from "@flashcards/content/types/SpokenText";

/** Speaks a word in the language being learned wherever it is on screen, in the choices handed in. A word with no recording is silent. */
export function useSpeakWord(): (spoken: SpokenText, choices: AudioChoices) => void {
  const kept = useAppSelector(selectKeptTexts);

  return useCallback(
    (spoken: SpokenText, choices: AudioChoices): void => {
      speakText(kept, spoken, choices);
    },
    [kept],
  );
}
