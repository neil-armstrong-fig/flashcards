/** What is waiting today, split by the kind of card: new ones, ones being learned or relearned, and reviews. */
export interface DueCounts {
  readonly new: number;
  readonly learning: number;
  readonly review: number;
}
