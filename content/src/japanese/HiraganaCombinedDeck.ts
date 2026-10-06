import {COMBINED_KANA} from "@flashcards/content/japanese/kana-table/CombinedKana";
import {kanaNotesOf} from "@flashcards/content/japanese/kana-notes/KanaNotesOf";
import type {Deck} from "@flashcards/content/types/Deck";

/** The 33 hiragana made of an i-row kana and a small ya, yu or yo (きゃ, しゅ, ちょ), read as one syllable: for after the core hiragana. */
export const HIRAGANA_COMBINED_DECK: Deck = {
  id: "ja-hiragana-combined",
  name: "Japanese Hiragana, combined",
  language: "ja",
  notes: kanaNotesOf(COMBINED_KANA, "hiragana"),
};
