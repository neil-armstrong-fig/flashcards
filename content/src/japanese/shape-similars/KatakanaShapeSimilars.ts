import type {ShapePair} from "@flashcards/content/types/ShapePair";

/**
 * The katakana learners commonly take for one another, in pairs: シ and ツ differ in the angle of the strokes, ソ and ン in
 * where the short stroke starts, ウ and ワ in the small top stroke, ク and タ in the extra stroke, マ and ム in the line
 * through the corner, and ヌ and ス in the extra stroke. A pair is listed once and applies to both of its characters.
 */
export const KATAKANA_SHAPE_PAIRS: readonly ShapePair[] = [
  ["シ", "ツ"],
  ["ソ", "ン"],
  ["ウ", "ワ"],
  ["ク", "タ"],
  ["マ", "ム"],
  ["ヌ", "ス"],
];
