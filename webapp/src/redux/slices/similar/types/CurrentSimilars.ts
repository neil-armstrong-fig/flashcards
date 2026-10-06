import type {ShapeSimilar} from "@flashcards/content/types/ShapeSimilar";
import type {Similar} from "@src/redux/slices/similar/types/Similar";

/** What the card on screen is easily mixed up with. Either may be empty: most cards have neither. */
export interface CurrentSimilars {
  readonly shape: readonly ShapeSimilar[];
  readonly sound: Similar | undefined;
}
