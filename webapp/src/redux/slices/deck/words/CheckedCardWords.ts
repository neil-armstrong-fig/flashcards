import {englishMeaningFrom} from "@language-learning/shared/language/EnglishText";
import {koreanWordFrom} from "@language-learning/shared/language/KoreanText";
import {romanisationFrom} from "@language-learning/shared/language/RomanisationText";
import type {CardWords} from "@src/redux/slices/deck/types/CardWords";
import type {CheckedWords} from "@src/redux/slices/deck/words/types/CheckedWords";
import type {VocabNote} from "@language-learning/content/types/VocabNote";

/**
 * What the learner typed for a card, checked: a Korean word of up to twelve characters, an English meaning of up to forty, and how it
 * is said in Latin letters. A word that another card already has is refused, except by the card being changed (`ownId`).
 */
export function checkedCardWords(
  words: CardWords,
  existing: readonly VocabNote[],
  ownId: string | undefined,
): CheckedWords {
  const word = koreanWordFrom(words.word);
  const meaning = englishMeaningFrom(words.meaning);
  const romanisation = romanisationFrom(words.romanisation);

  if (word === undefined) {
    return {kind: "refused", message: "Type a Korean word, up to twelve characters."};
  }

  if (meaning === undefined) {
    return {kind: "refused", message: "Type what it means in English, up to forty letters."};
  }

  if (romanisation === undefined) {
    return {kind: "refused", message: "Type how it is said in Latin letters, up to forty."};
  }

  if (existing.some(note => note.id !== ownId && note.word === word)) {
    return {kind: "refused", message: "That word is already here."};
  }

  return {kind: "checked", word, meaning, romanisation};
}
