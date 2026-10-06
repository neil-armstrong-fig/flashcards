import {DEFAULT_DECK_PREFERENCES} from "@src/redux/slices/settings/limits/DefaultDeckPreferences";
import type {DeckPreferences} from "@src/redux/slices/settings/types/DeckPreferences";
import type {RootState} from "@src/redux/Store";

/** How the deck is heard and shown: what the learner chose for it, else the defaults. */
export function selectDeckPreferences(state: RootState, deckId: string): DeckPreferences {
  return state.settings.deckPreferences[deckId] ?? DEFAULT_DECK_PREFERENCES;
}
