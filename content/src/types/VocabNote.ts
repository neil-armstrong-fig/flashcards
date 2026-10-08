import type {NoteKind} from "@flashcards/content/types/NoteKind";
import type {Notation} from "@flashcards/content/types/Notation";
import type {ShapeSimilar} from "@flashcards/content/types/ShapeSimilar";
import type {Subject} from "@flashcards/shared/language/Subject";

/**
 * A word to learn: the facts about it, not a card. Each note is studied as two cards, one in each direction (see
 * `cards/CardsOfDeck`). The `id` is stable for ever, because the ids of its cards, and so a learner's progress, are built from it.
 */
export interface VocabNote {
  readonly id: string;
  /** Absent means `vocab`. A `pronunciation` note is a word read aloud from its spelling (`word`), whose `meaning` is how it is actually said, in hangul, and which has one card only: the spelling is shown unspoken, and the way it is said is shown and the word spoken with the answer. A `sounds-alike` note is one of two words that differ by one sound: `meaning` is both, written `바르다/빠르다` and shown on both its card and its partner's, `word` is the one this note says, and `soundSimilars` holds the other. Its one card plays `word` and, with the answer, picks it out in bold. A `sheet-music` note is one pitch drawn on a staff (`notation`): `word` is its name (`C4`), which is also what is played, and it has one card only, the staff first and the name and the note played with the answer. A `kana` note is a character and its sound: its `meaning` is that sound in Latin letters, which is shown but never spoken, since an English voice would say it wrongly. */
  readonly kind?: NoteKind;
  readonly language: Subject;
  readonly word: string;
  readonly meaning: string;
  readonly romanisation: string;
  /** Words it is easily mistaken for by ear (물 and 불), to hear beside it. Recorded ahead like the word itself; the learner adds more. */
  readonly soundSimilars?: readonly string[];
  /** Characters easily taken for this one by their shape (シ and ツ), shown once the answer is. Only a kana note has them, and they are not spoken. */
  /** Why the note is as it is, in a sentence or two, shown once the answer is: why a rare kana exists and where it turns up. Spoken never. */
  readonly explanation?: string;
  /** Where a `sheet-music` note is drawn. */
  readonly notation?: Notation;
  readonly shapeSimilars?: readonly ShapeSimilar[];
}
