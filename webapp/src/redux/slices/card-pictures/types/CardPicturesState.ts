export interface CardPicturesState {
  /** The address to show each card's picture by, keyed by card id. A card with no picture has no entry. */
  readonly byCard: Readonly<Record<string, string>>;
  /** When each picture was added or last renewed, as an ISO timestamp, by card id: fading counts the answers given since. */
  readonly addedAt: Readonly<Record<string, string>>;
  /** True once the pictures kept on this device have been read (or could not be), so a card is not shown bare while they are on their way. */
  readonly loaded: boolean;
  /** Why the last picture was refused or could not be kept. Absent when there is none. */
  readonly error?: string;
}
