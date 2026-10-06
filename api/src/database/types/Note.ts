/** A card the learner made: a Korean word, what it means, and how it is said in the Latin alphabet. */
export interface Note {
  readonly id: string;
  readonly word: string;
  readonly meaning: string;
  readonly romanisation: string;
}
