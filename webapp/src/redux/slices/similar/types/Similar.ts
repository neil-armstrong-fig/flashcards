/** The word on a card in Korean, and the words it is compared with. */
export interface Similar {
  readonly noteId: string;
  /** The word itself. */
  readonly own: string;
  /** Every similar, in the order shown: shipped first, then learned. */
  readonly words: readonly string[];
  /** The similars shipped with the word: they cannot be deleted. */
  readonly shipped: readonly string[];
  /** The similars the learner asked for, oldest first: they can. */
  readonly learned: readonly string[];
}
