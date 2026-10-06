/** What a deck's row on the home screen says is waiting today, split into new, learning and review. */
export interface DeckDueCounts {
  /** Cards never seen before. */
  readonly new: number;
  /** Cards being learned, or relearned after being forgotten. */
  readonly learning: number;
  /** Cards coming back for review. */
  readonly review: number;
}
