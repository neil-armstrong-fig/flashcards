import {EXTENDED_KATAKANA} from "@flashcards/content/japanese/extended-katakana/ExtendedKatakana";
import {shapeSimilarsOf} from "@flashcards/content/japanese/shape-similars/ShapeSimilarsOf";
import {soundSimilarsOf} from "@flashcards/content/japanese/sound-similars/SoundSimilarsOf";
import {KANA} from "@flashcards/content/japanese/Kana";
import type {Deck} from "@flashcards/content/types/Deck";

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
