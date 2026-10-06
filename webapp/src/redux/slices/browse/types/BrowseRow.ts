import type {CardStatus} from "@src/spaced-repetition/card/types/CardStatus";

/** One card in the list of every card: its words, and where it is in its life. */
export interface BrowseRow {
  readonly id: string;
  /** The word the card is made from: its two cards share similars. */
  readonly noteId: string;
  readonly front: string;
  readonly back: string;
  /** How the Korean word is said in Latin letters. */
  readonly hint: string;
  /** The Korean word, which is what playing the row says whichever side it is on. */
  readonly korean: string;
  readonly status: CardStatus;
}
