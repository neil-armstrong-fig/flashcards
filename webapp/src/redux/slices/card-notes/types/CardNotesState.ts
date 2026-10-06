export interface CardNotesState {
  /** The learner's own memory aid for a card, by card id. A card with no note has no entry. */
  readonly byCard: Readonly<Record<string, string>>;
  /** When each note was written or last renewed, as an ISO timestamp, by card id: fading counts the answers given since. An empty text means it is not known. */
  readonly addedAt: Readonly<Record<string, string>>;
}
