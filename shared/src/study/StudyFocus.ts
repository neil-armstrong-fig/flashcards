/** What a session studies of the deck's work for today: all of it, only the new cards, only the cards the learner is struggling with, or a look ahead at reviews not yet due (whose answers change nothing). */
export const STUDY_FOCUSES = ["all", "new", "struggling", "ahead"] as const;

export type StudyFocus = (typeof STUDY_FOCUSES)[number];
