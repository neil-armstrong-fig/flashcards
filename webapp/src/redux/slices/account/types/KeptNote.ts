/** A card the learner made, as the API keeps it. */
export interface KeptNote {
  readonly id: string;
  readonly word: string;
  readonly meaning: string;
  readonly romanisation: string;
}
