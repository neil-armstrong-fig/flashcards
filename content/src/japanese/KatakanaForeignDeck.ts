import {EXTENDED_KATAKANA} from "@flashcards/content/japanese/extended-katakana/ExtendedKatakana";
import type {Deck} from "@flashcards/content/types/Deck";

/** The 23 katakana made for the sounds of foreign words (ファ, ティ, ヴ), each with why it exists. They turn up only in loanwords and names, so they are last. */
export const KATAKANA_FOREIGN_DECK: Deck = {
  id: "ja-katakana-foreign",
  name: "Japanese Katakana, foreign sounds",
  language: "ja",
  notes: EXTENDED_KATAKANA.map(kana => ({
    id: `ja-katakana-${kana.romaji}`,
    kind: "kana",
    language: "ja",
    word: kana.katakana,
    meaning: kana.romaji,
    romanisation: "",
    explanation: kana.explanation,
  })),
};
