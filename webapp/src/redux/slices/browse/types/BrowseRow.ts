import type {Notation} from "@flashcards/content/types/Notation";
import type {SpokenText} from "@flashcards/content/types/SpokenText";
import type {CardStatus} from "@src/spaced-repetition/card/types/CardStatus";

/** One card in the list of every card: its words, and where it is in its life. */
export interface BrowseRow {
  readonly id: string;
  /** The word the card is made from: its two cards share similars. */
  readonly noteId: string;
  readonly front: string;
  /** A note drawn on a staff, shown in place of `front` on a sheet music card. */
  readonly notation?: Notation;
  readonly back: string;
  /** How the word is said in Latin letters. */
  readonly hint: string;
  /** The word in the language being learned, which is what playing the row says whichever side it is on. */
  readonly spoken?: SpokenText;
  readonly status: CardStatus;
}
