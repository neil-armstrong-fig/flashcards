import type {DeckOffline} from "@src/redux/slices/offline/types/DeckOffline";

/** What of each deck's audio is on this device, by deck id. A deck is absent until its count has been taken. */
export interface OfflineState {
  readonly decks: Readonly<Record<string, DeckOffline>>;
}
