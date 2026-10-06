import {KANA} from "@language-learning/content/japanese/Kana";
import {HIRAGANA_SHAPE_PAIRS} from "@language-learning/content/japanese/shape-similars/HiraganaShapeSimilars";
import {KATAKANA_SHAPE_PAIRS} from "@language-learning/content/japanese/shape-similars/KatakanaShapeSimilars";
import type {ShapeSimilar} from "@language-learning/content/types/ShapeSimilar";

/** The kana a character is easily taken for (in its own script), with their sounds, or none: a pair is listed once and works from either side. */
export function shapeSimilarsOf(character: string): readonly ShapeSimilar[] {
  const alikes: ShapeSimilar[] = [];

  for (const [first, second] of [...KATAKANA_SHAPE_PAIRS, ...HIRAGANA_SHAPE_PAIRS]) {
    const other = otherOf(character, first, second);
    const sound = KANA.find(kana => kana.katakana === other || kana.hiragana === other)?.romaji;

    if (other !== undefined && sound !== undefined) {
      alikes.push({character: other, sound});
    }
  }

  return alikes;
}

function otherOf(character: string, first: string, second: string): string | undefined {
  if (character === first) {
    return second;
  }

  if (character === second) {
    return first;
  }

  return undefined;
}
