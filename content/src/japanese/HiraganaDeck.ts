import {shapeSimilarsOf} from "@flashcards/content/japanese/shape-similars/ShapeSimilarsOf";
import {soundSimilarsOf} from "@flashcards/content/japanese/sound-similars/SoundSimilarsOf";
import {KANA} from "@flashcards/content/japanese/Kana";
import type {Deck} from "@flashcards/content/types/Deck";

/** Every hiragana (basic, voiced and combined), each studied both ways: the character to its sound, and the sound to the character. */
export const HIRAGANA_DECK: Deck = {
  id: "ja-hiragana",
  name: "Japanese Hiragana",
  language: "ja",
  notes: KANA.map(kana => ({
    id: `ja-hiragana-${kana.romaji}`,
    kind: "kana",
    language: "ja",
    word: kana.hiragana,
    meaning: kana.romaji,
    romanisation: "",
    soundSimilars: soundSimilarsOf(kana, "hiragana"),
    shapeSimilars: shapeSimilarsOf(kana.hiragana),
  })),
};
