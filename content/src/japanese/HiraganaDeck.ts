import {CORE_KANA} from "@flashcards/content/japanese/kana-table/CoreKana";
import {kanaNotesOf} from "@flashcards/content/japanese/kana-notes/KanaNotesOf";
import type {Deck} from "@flashcards/content/types/Deck";

/** The hiragana to learn first, each studied both ways: the character to its sound, and the sound to the character. The 46 basic ones, then the 25 with dakuten. The combined ones are in `HiraganaCombinedDeck`. */
export const HIRAGANA_DECK: Deck = {
  id: "ja-hiragana",
  name: "Japanese Hiragana",
  language: "ja",
  notes: kanaNotesOf(CORE_KANA, "hiragana"),
};
