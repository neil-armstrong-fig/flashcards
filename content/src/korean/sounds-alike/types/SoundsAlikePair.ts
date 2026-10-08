/** One of the two words of a pair, with how it is written in Latin letters. */
export interface PairedWord {
  readonly word: string;
  readonly romanisation: string;
}

/** Two words that differ by one sound, to be told apart by ear. The `id` is written out and never changes: both cards' ids are built from it. */
export interface SoundsAlikePair {
  readonly id: string;
  readonly first: PairedWord;
  readonly second: PairedWord;
  /** What the two words mean and which sound tells them apart, shown with the answer. */
  readonly explanation: string;
}
