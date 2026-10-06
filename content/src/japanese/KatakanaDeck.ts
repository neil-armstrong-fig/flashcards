import {CORE_KANA} from "@flashcards/content/japanese/kana-table/CoreKana";
import {kanaNotesOf} from "@flashcards/content/japanese/kana-notes/KanaNotesOf";
import type {Deck} from "@flashcards/content/types/Deck";

/** The katakana to learn first, each studied both ways (the character to its sound, and the sound to the character): the 46 basic ones, then the 25 with dakuten. The combined ones are in `KatakanaCombinedDeck`, and those made for foreign sounds in `KatakanaForeignDeck`. */
export const KATAKANA_DECK: Deck = {
  id: "ja-katakana",
  name: "Japanese Katakana",
  language: "ja",
  notes: kanaNotesOf(CORE_KANA, "katakana"),
};
