/** The words of a card, each checked: or why they cannot be used, in words the learner can read. */
export type CheckedWords =
  | {readonly kind: "checked"; readonly word: string; readonly meaning: string; readonly romanisation: string}
  | {readonly kind: "refused"; readonly message: string};
