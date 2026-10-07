/** What the learner makes that is kept online one record at a time: their own cards, the similar words they added, and the notes and pictures on their cards. */
export const RECORD_KINDS = ["note", "similar", "memory-note", "picture"] as const;

export type RecordKind = (typeof RECORD_KINDS)[number];
