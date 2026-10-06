import {SHIPPED_DECKS} from "@flashcards/content/decks/ShippedDecks";
import {STARTER_DECK} from "@flashcards/content/korean/StarterDeck";
import {noteIdOfCard} from "@src/spaced-repetition/queue/siblings/NoteIdOfCard";

const DECK_OF_NOTE = new Map(SHIPPED_DECKS.flatMap(deck => deck.notes.map(note => [note.id, deck.id] as const)));

/**
 * The deck a card is studied in, which has its own limits and its own session. A card the learner made joins the Korean starter
 * deck, as it is the one Korean deck there is.
 */
export function deckIdOfCard(cardId: string): string {
  return DECK_OF_NOTE.get(noteIdOfCard(cardId)) ?? STARTER_DECK.id;
}
