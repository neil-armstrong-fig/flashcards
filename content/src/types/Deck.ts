import type {Language} from "@language-learning/shared/language/Language";
import type {VocabNote} from "@language-learning/content/types/VocabNote";

export interface Deck {
  readonly id: string;
  readonly name: string;
  readonly language: Language;
  readonly notes: readonly VocabNote[];
}
