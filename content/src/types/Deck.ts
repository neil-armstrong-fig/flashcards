import type {Subject} from "@flashcards/shared/language/Subject";
import type {VocabNote} from "@flashcards/content/types/VocabNote";

export interface Deck {
  readonly id: string;
  readonly name: string;
  readonly language: Subject;
  readonly notes: readonly VocabNote[];
  /** Whether the learner may choose a voice and a speed for the deck, in its settings and under a card. Absent means yes; `false` for a deck with nothing spoken to choose between (the notes of music). */
  readonly offersVoiceAndSpeed?: boolean;
}
