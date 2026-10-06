import {cardsOfDeck} from "@language-learning/content/cards/CardsOfDeck";
import {cardsOfNote} from "@language-learning/content/cards/CardsOfNote";
import {createSelector} from "@reduxjs/toolkit";
import {SHIPPED_DECKS} from "@language-learning/content/decks/ShippedDecks";
import type {DeckCard} from "@language-learning/content/types/DeckCard";
import type {RootState} from "@src/redux/Store";

const DECK_CARDS = SHIPPED_DECKS.flatMap(cardsOfDeck);

/**
 * Every card being studied, in the order new ones are introduced: the deck's own, then both cards of each note the learner made,
 * oldest first. It is the order the study state keeps (`cardsAdded` appends in it), so the list and the queue agree.
 */
export const selectCards = createSelector([(state: RootState) => state.deck.notes], (made): readonly DeckCard[] => [
  ...DECK_CARDS,
  ...made.flatMap(cardsOfNote),
]);
