export interface SimilarState {
  /** The similar words the learner asked for, by the id of the note they are kept with: a word's two cards share them. */
  readonly words: Readonly<Record<string, readonly string[]>>;
  /** True while a word's recordings are being fetched. */
  readonly adding: boolean;
  /** Why the last word could not be added. Absent when there is none. */
  readonly error?: string;
}
