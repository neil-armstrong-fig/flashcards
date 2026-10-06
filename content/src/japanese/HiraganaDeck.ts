import {shapeSimilarsOf} from "@language-learning/content/japanese/shape-similars/ShapeSimilarsOf";
import {soundSimilarsOf} from "@language-learning/content/japanese/sound-similars/SoundSimilarsOf";
import {KANA} from "@language-learning/content/japanese/Kana";
import type {Deck} from "@language-learning/content/types/Deck";

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
