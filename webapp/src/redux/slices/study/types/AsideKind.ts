/** The two ways to hide a card without answering it: until tomorrow, or until the learner brings it back. */
export const ASIDE_KINDS = ["bury", "suspend"] as const;

export type AsideKind = (typeof ASIDE_KINDS)[number];
