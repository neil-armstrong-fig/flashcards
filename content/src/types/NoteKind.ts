/** What a note teaches: a word with a meaning in English, or a kana character with the sound it makes. */
export const NOTE_KINDS = ["vocab", "kana"] as const;

export type NoteKind = (typeof NOTE_KINDS)[number];
