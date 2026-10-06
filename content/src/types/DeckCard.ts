import type {CardDirection} from "@flashcards/content/CardDirection";
import type {SpokenText} from "@flashcards/content/types/SpokenText";

/** One side-to-side question made from a note. Its `id` is the note's id and its direction, and is stable for ever. */
export interface DeckCard {
  readonly id: string;
  readonly noteId: string;
  readonly direction: CardDirection;
  readonly front: string;
  readonly back: string;
  /** What is said aloud when the front comes up, and when the answer is shown; absent where that side is not spoken (the sound of a kana). */
  readonly frontAudio?: SpokenText;
  readonly backAudio?: SpokenText;
  /** How the language being learned is said, shown with the answer (romanisation for Korean). */
  readonly hint: string;
}
