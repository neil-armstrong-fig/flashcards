export const STUDY_STATUSES = ["loading", "ready"] as const;

export type StudyStatus = (typeof STUDY_STATUSES)[number];
