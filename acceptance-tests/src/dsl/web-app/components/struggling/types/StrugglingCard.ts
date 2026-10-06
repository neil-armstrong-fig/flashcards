/** One row of the Struggling list, as the learner reads it. */
export interface StrugglingCard {
  readonly front: string;
  readonly back: string;
  /** How many times the card has been forgotten once it was being reviewed. */
  readonly lapses: number;
  /** `Suspended` where the app has set the card aside, else empty. */
  readonly status: string;
}
