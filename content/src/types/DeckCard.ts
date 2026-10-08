import type {CardDirection} from "@flashcards/content/CardDirection";
import type {Notation} from "@flashcards/content/types/Notation";
import type {SpokenText} from "@flashcards/content/types/SpokenText";

/** One side-to-side question made from a note. Its `id` is the note's id and its direction, and is stable for ever. */
export interface DeckCard {
  readonly id: string;
  readonly noteId: string;
  readonly direction: CardDirection;
  /** Text on the front: empty on a sheet music card, whose front is `notation`. */
  readonly front: string;
  /** A note drawn on a staff in place of the front text. */
  readonly notation?: Notation;
  readonly back: string;
  /** What is said aloud when the front comes up, and when the answer is shown; absent where that side is not spoken (the sound of a kana). */
  readonly frontAudio?: SpokenText;
  readonly backAudio?: SpokenText;
  /** The part of `back` shown in bold with the answer (the word that was said, on a sounds-alike pair). */
  readonly emphasis?: string;
  /** How the language being learned is said, shown with the answer (romanisation for Korean). */
  readonly hint: string;
}
