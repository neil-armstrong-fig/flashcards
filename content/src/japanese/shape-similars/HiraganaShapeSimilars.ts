import type {ShapePair} from "@language-learning/content/types/ShapePair";

/**
 * The hiragana learners commonly take for one another, in pairs: ぬ and め differ in the loop at the end of the stroke, わ, れ
 * and ね share a left stem and differ in how the right-hand stroke ends (so they make three pairs), る and ろ in the loop at the
 * foot, は and ほ in the extra bar, and さ and ち in whether the top stroke is joined. A pair is listed once and applies to
 * both of its characters.
 */
export const HIRAGANA_SHAPE_PAIRS: readonly ShapePair[] = [
  ["ぬ", "め"],
  ["わ", "れ"],
  ["わ", "ね"],
  ["れ", "ね"],
  ["る", "ろ"],
  ["は", "ほ"],
  ["さ", "ち"],
];
