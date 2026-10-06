/** The limits and allowances that shape what is studied today. */
export interface QueueSettings {
  /** How many new cards may be introduced in one study day. */
  readonly newCardsPerDay: number;
  /** How many review cards may be done in one study day. Cards being learned are not counted. */
  readonly maxReviewsPerDay: number;
  /** How many minutes ahead a learning card may be shown early, when nothing else is waiting. */
  readonly learnAheadMinutes: number;
}
