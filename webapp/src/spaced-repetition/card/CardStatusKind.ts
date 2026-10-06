/** Where a card is, as a learner would say it. */
export const CARD_STATUS_KINDS = ["new", "learning", "due", "scheduled", "suspended", "buried"] as const;

export type CardStatusKind = (typeof CARD_STATUS_KINDS)[number];
