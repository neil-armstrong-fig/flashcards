import {useCallback} from "react";
import {selectKeptTexts} from "@src/redux/shared/kept-texts/SelectKeptTexts";
import {speakText} from "@src/audio/speak/SpeakText";
import {useAppSelector} from "@src/redux/shared/Hooks";
import type {AudioChoices} from "@src/audio/types/AudioChoices";

/** Speaks a Korean word wherever it is on screen, in the choices handed in. A word with no recording is silent. */
export function useSpeakWord(): (text: string, choices: AudioChoices) => void {
  const kept = useAppSelector(selectKeptTexts);

  return useCallback(
    (text: string, choices: AudioChoices): void => {
      speakText(kept, {language: "ko", text}, choices);
    },
    [kept],
  );
}
