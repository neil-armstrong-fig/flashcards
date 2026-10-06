import {useCallback} from "react";
import {selectKeptTexts} from "@src/redux/shared/kept-texts/SelectKeptTexts";
import {speakTextsInOrder} from "@src/audio/speak/SpeakTextsInOrder";
import {useAppSelector} from "@src/redux/shared/Hooks";
import type {AudioChoices} from "@src/audio/types/AudioChoices";
import type {Language} from "@flashcards/shared/language/Language";

/** Speaks a word and the ones it is mistaken for, one after the other, in the choices handed in. A word with no recording is skipped. */
export function useSpeakSimilar(): (texts: readonly string[], language: Language, choices: AudioChoices) => void {
  const kept = useAppSelector(selectKeptTexts);

  return useCallback(
    (texts: readonly string[], language: Language, choices: AudioChoices): void => {
      speakTextsInOrder(
        kept,
        texts.map(text => ({language, text})),
        choices,
      );
    },
    [kept],
  );
}
