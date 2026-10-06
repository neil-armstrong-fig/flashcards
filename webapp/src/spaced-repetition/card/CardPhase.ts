/** Where a card is in its life: new, learning, review or relearning. */
export const CARD_PHASES = ["new", "learning", "review", "relearning"] as const;

export type CardPhase = (typeof CARD_PHASES)[number];
