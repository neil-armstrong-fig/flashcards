import {EXTENDED_KATAKANA} from "@language-learning/content/japanese/extended-katakana/ExtendedKatakana";
import {shapeSimilarsOf} from "@language-learning/content/japanese/shape-similars/ShapeSimilarsOf";
import {soundSimilarsOf} from "@language-learning/content/japanese/sound-similars/SoundSimilarsOf";
import {KANA} from "@language-learning/content/japanese/Kana";
import type {Deck} from "@language-learning/content/types/Deck";

/** Every katakana, each studied both ways (the character to its sound, and the sound to the character): the basic, voiced and combined ones, then those made for foreign sounds. */
export const KATAKANA_DECK: Deck = {
  id: "ja-katakana",
  name: "Japanese Katakana",
  language: "ja",
  notes: [
    ...KANA.map(kana => ({
      id: `ja-katakana-${kana.romaji}`,
      kind: "kana" as const,
      language: "ja" as const,
      word: kana.katakana,
      meaning: kana.romaji,
      romanisation: "",
      soundSimilars: soundSimilarsOf(kana, "katakana"),
      shapeSimilars: shapeSimilarsOf(kana.katakana),
    })),
    ...EXTENDED_KATAKANA.map(kana => ({
      id: `ja-katakana-${kana.romaji}`,
      kind: "kana" as const,
      language: "ja" as const,
      word: kana.katakana,
      meaning: kana.romaji,
      romanisation: "",
      explanation: kana.explanation,
    })),
  ],
};
