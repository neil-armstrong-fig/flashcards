import {SHIPPED_DECKS} from "@flashcards/content/decks/ShippedDecks";

/** Whether the learner may choose a voice and speed for a deck. Yes unless the deck says no, and for a deck the app does not ship (none yet). */
export function deckOffersVoiceAndSpeed(deckId: string | undefined): boolean {
  return SHIPPED_DECKS.find(deck => deck.id === deckId)?.offersVoiceAndSpeed !== false;
}
