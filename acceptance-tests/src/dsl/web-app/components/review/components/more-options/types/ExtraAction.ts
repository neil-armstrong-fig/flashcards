export const EXTRA_ACTIONS = ["picture", "note", "hard", "bury", "suspend"] as const;

/** What the learner can do to a card that is not answering it: kept out of the way, in the more options. */
export type ExtraAction = (typeof EXTRA_ACTIONS)[number];
