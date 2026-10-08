import type {Clef} from "@flashcards/content/types/Clef";

/** A note to be drawn on a staff: its clef, and its pitch named as `C4` is (`naturalNoteFrom` reads it). */
export interface Notation {
  readonly clef: Clef;
  readonly pitch: string;
}
