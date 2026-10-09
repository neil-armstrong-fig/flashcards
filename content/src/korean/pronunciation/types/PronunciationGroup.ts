/** A word whose spelling is not how it is said. `said` is the sound in hangul as the standard pronunciation (표준 발음법) gives it. */
export interface PronouncedWord {
  /** Stable for ever, like any note id: written out, never worked out from the word. */
  readonly id: string;
  readonly word: string;
  readonly said: string;
  /** The Revised Romanization of how it is said. */
  readonly romanisation: string;
  /** What the word means in English, shown with the sound. */
  readonly translation: string;
}

/** The words that change by one sound rule, and the rule in a sentence or two, shown with each answer. */
export interface PronunciationGroup {
  readonly rule: string;
  readonly explanation: string;
  readonly words: readonly PronouncedWord[];
}
