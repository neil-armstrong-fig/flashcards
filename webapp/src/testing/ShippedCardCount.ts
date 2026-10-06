import {cardsOfDeck} from "@language-learning/content/cards/CardsOfDeck";
import {SHIPPED_DECKS} from "@language-learning/content/decks/ShippedDecks";

/** How many cards the shipped decks make: what a fresh store holds before the learner makes any of their own. */
export const SHIPPED_CARD_COUNT = SHIPPED_DECKS.flatMap(cardsOfDeck).length;
