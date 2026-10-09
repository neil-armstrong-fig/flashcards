import type {Subject} from "@flashcards/shared/language/Subject";
import type {VocabNote} from "@flashcards/content/types/VocabNote";

export interface Deck {
  readonly id: string;
  readonly name: string;
  readonly language: Subject;
  readonly notes: readonly VocabNote[];
  /** Note ids no longer studied but still belonging to this deck, so their stored history cannot be mistaken for another deck's. */
  readonly retiredNoteIds?: readonly string[];
  /** Whether the learner may choose a voice and a speed for the deck, in its settings and under a card. Absent means yes; `false` for a deck with nothing spoken to choose between (the notes of music). */
  readonly offersVoiceAndSpeed?: boolean;
}
