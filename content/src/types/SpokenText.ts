import type {SpokenLanguage} from "@flashcards/shared/language/SpokenLanguage";

/** Words said aloud, and the language they are said in. */
export interface SpokenText {
  readonly language: SpokenLanguage;
  readonly text: string;
}
