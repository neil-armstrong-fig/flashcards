/** A Dutch word read from its spelling. `said` is how it sounds, respelt for an English reader. */
export interface PronouncedWord {
  /** Stable for ever, like any note id: written out, never worked out from the word. */
  readonly id: string;
  readonly word: string;
  /** Syllable by syllable in English letters, the stressed syllable in capitals (`MAH kuhn`). */
  readonly said: string;
  /** What the word means in English, shown with the sound. */
  readonly translation: string;
}
