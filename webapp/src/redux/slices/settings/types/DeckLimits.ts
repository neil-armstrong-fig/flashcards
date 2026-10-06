/** What one deck may ask of the learner in a study day. */
export interface DeckLimits {
  /** How many new cards of the deck may be introduced. */
  readonly newCardsPerDay: number;
  /** How many of the deck's review cards may be done. The rule of thumb is ten times the new cards. */
  readonly maxReviewsPerDay: number;
}
