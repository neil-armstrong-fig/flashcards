import {koreanWordFrom} from "@flashcards/shared/language/KoreanText";
import {romanisationFrom} from "@flashcards/shared/language/RomanisationText";
import {romanize} from "koroman";

/**
 * How a Korean word is said in Latin letters, by the Revised Romanization of Korean: written as it is pronounced, so 학교 is
 * `hakgyo` and 한국 is `hanguk`. `undefined` for anything that is not a Korean word as `koreanWordFrom` has it, so what comes out
 * is always something `romanisationFrom` accepts. A suggestion for the learner to correct, not a fact: names and unusual words
 * can differ.
 */
export function romanisationOf(text: string): string | undefined {
  const word = koreanWordFrom(text);

  if (word === undefined) {
    return undefined;
  }

  return romanisationFrom(romanize(word, {usePronunciationRules: true, casingOption: "lowercase"}));
}
