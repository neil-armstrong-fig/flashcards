/** How much of a deck's audio is on the device: the recordings kept, out of all the deck has. */
export interface OfflineStatus {
  readonly kept: number;
  readonly total: number;
}
