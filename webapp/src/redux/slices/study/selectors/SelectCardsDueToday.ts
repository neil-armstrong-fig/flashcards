import {SHIPPED_DECKS} from "@flashcards/content/decks/ShippedDecks";
import {selectDeckCardsDueToday} from "@src/redux/slices/study/selectors/SelectDeckCardsDueToday";
import type {RootState} from "@src/redux/Store";

/** How many cards are waiting today across every deck, each within its own limits. */
export function selectCardsDueToday(state: RootState): number {
  return SHIPPED_DECKS.reduce((total, deck) => total + selectDeckCardsDueToday(state, deck.id), 0);
}
