/** What one deck may ask of the learner in a study day. */
export interface DeckLimits {
  /** How many new cards of the deck may be introduced. */
  readonly newCardsPerDay: number;
  /** How many of the deck's review cards may be done. While the limits are locked it is ten times the new cards. */
  readonly maxReviewsPerDay: number;
  /** Whether the reviews may be set apart from the new cards. Locked, they follow the new cards at ten for each. */
  readonly limitsUnlocked: boolean;
}
