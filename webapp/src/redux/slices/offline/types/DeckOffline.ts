/** How much of one deck's audio is on this device, and whether more is being fetched. */
export interface DeckOffline {
  /** Recordings on the device, or while fetching how many have been dealt with so far. */
  readonly kept: number;
  /** Recordings the deck has. */
  readonly total: number;
  /** True while the deck's recordings are being fetched. */
  readonly working: boolean;
  /** True where the last fetch could not get every recording: no connection, or signed out. */
  readonly incomplete: boolean;
}
