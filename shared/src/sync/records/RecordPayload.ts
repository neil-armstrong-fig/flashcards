import type {PictureType} from "@flashcards/shared/sync/records/PictureType";

/** A card the learner made: its two sides and how the Korean is said in Latin letters. */
export interface NotePayload {
  readonly word: string;
  readonly meaning: string;
  readonly romanisation: string;
}

/** A word the learner added to a card's similar words. */
export interface SimilarPayload {
  readonly noteId: string;
  readonly text: string;
}

/** The learner's own note on a card. */
export interface MemoryNotePayload {
  readonly text: string;
}

/** The learner's picture on a card: the image itself is kept apart, under its hash. */
export interface PicturePayload {
  /** SHA-256 of the image's bytes, in lower-case hexadecimal. */
  readonly hash: string;
  readonly type: PictureType;
}

export type RecordPayload = NotePayload | SimilarPayload | MemoryNotePayload | PicturePayload;
