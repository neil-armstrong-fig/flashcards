import type {Language} from "@flashcards/shared/language/Language";
import type {VocabNote} from "@flashcards/content/types/VocabNote";

export interface Deck {
  readonly id: string;
  readonly name: string;
  readonly language: Language;
  readonly notes: readonly VocabNote[];
}
