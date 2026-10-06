/** What the learner types to make a card of their own. */
export interface NewCardWords {
  /** The Korean word. */
  readonly word: string;
  /** What it means, in English. */
  readonly meaning: string;
  /** How it is said, in Latin letters. Left out, the app's own suggestion for the word is used. */
  readonly romanisation?: string;
}
