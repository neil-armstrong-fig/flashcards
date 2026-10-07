/** What can happen to a card that a replay needs to know: an answer, or the learner hiding, bringing back or flagging it. */
export const CARD_EVENT_KINDS = ["answer", "suspend", "unsuspend", "bury", "hard"] as const;

export type CardEventKind = (typeof CARD_EVENT_KINDS)[number];
