/** One row of the list of every card, as the learner reads it. */
export interface BrowsedCard {
  readonly front: string;
  readonly back: string;
  /** How the Korean word is said in Latin letters. */
  readonly hint: string;
  /** Where the card is in its life, in the words the app uses: `New`, `Learning`, `Due`, `Due in 4d`, `Suspended`. */
  readonly status: string;
}
