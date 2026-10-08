/** What a note teaches: a word with a meaning in English, a kana character with the sound it makes, a word whose spelling is not how it is said, or one of two words told apart by ear, or a note of music read off a staff. */
export const NOTE_KINDS = ["vocab", "kana", "pronunciation", "sounds-alike", "sheet-music"] as const;

export type NoteKind = (typeof NOTE_KINDS)[number];
