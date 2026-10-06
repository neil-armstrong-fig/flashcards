/** A picture on a card as the store shows it: where to find it, and when it was put there. */
export interface KeptPicture {
  /** The address to show the picture by (`blob:` in the app). */
  readonly address: string;
  /** When it was added or last renewed, as an ISO timestamp. An empty text means it is not known. */
  readonly addedAt: string;
}
