import {DEFAULT_DECK_LIMITS} from "@src/redux/slices/settings/limits/DefaultDeckLimits";
import type {DeckLimits} from "@src/redux/slices/settings/types/DeckLimits";
import type {RootState} from "@src/redux/Store";

/** What the deck may ask of the learner today: what they chose for it, else the defaults. */
export function selectDeckLimits(state: RootState, deckId: string): DeckLimits {
  return state.settings.deckLimits[deckId] ?? DEFAULT_DECK_LIMITS;
}
