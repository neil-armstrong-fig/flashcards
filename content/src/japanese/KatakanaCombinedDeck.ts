import {COMBINED_KANA} from "@flashcards/content/japanese/kana-table/CombinedKana";
import {kanaNotesOf} from "@flashcards/content/japanese/kana-notes/KanaNotesOf";
import type {Deck} from "@flashcards/content/types/Deck";

/** The 33 katakana made of an i-row kana and a small ya, yu or yo (キャ, シュ, チョ), read as one syllable: for after the core katakana. */
export const KATAKANA_COMBINED_DECK: Deck = {
  id: "ja-katakana-combined",
  name: "Japanese Katakana, combined",
  language: "ja",
  notes: kanaNotesOf(COMBINED_KANA, "katakana"),
};
