import {cardsOfDeck} from "@flashcards/content/cards/CardsOfDeck";
import {SHIPPED_DECKS} from "@flashcards/content/decks/ShippedDecks";

/** How many cards the shipped decks make: what a fresh store holds before the learner makes any of their own. */
export const SHIPPED_CARD_COUNT = SHIPPED_DECKS.flatMap(cardsOfDeck).length;
