import type {NoteKind} from "@flashcards/content/types/NoteKind";
import type {ShapeSimilar} from "@flashcards/content/types/ShapeSimilar";
import type {Language} from "@flashcards/shared/language/Language";

/**
 * A word to learn: the facts about it, not a card. Each note is studied as two cards, one in each direction (see
 * `cards/CardsOfDeck`). The `id` is stable for ever, because the ids of its cards, and so a learner's progress, are built from it.
 */
export interface VocabNote {
  readonly id: string;
  /** Absent means `vocab`. A `kana` note is a character and its sound: its `meaning` is that sound in Latin letters, which is shown but never spoken, since an English voice would say it wrongly. */
  readonly kind?: NoteKind;
  readonly language: Language;
  readonly word: string;
  readonly meaning: string;
  readonly romanisation: string;
  /** Words it is easily mistaken for by ear (물 and 불), to hear beside it. Recorded ahead like the word itself; the learner adds more. */
  readonly soundSimilars?: readonly string[];
  /** Characters easily taken for this one by their shape (シ and ツ), shown once the answer is. Only a kana note has them, and they are not spoken. */
  /** Why the note is as it is, in a sentence or two, shown once the answer is: why a rare kana exists and where it turns up. Spoken never. */
  readonly explanation?: string;
  readonly shapeSimilars?: readonly ShapeSimilar[];
}
