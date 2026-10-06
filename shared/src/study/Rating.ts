/** How well a learner recalled a card, from worst to best. The four labels are the four answer buttons. */
export const RATINGS = ["again", "hard", "good", "easy"] as const;

export type Rating = (typeof RATINGS)[number];
