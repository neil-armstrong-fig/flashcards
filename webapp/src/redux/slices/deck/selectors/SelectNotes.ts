import {createSelector} from "@reduxjs/toolkit";
import {SHIPPED_DECKS} from "@flashcards/content/decks/ShippedDecks";
import type {RootState} from "@src/redux/Store";
import type {VocabNote} from "@flashcards/content/types/VocabNote";

/** Every note being studied: the deck's own, then the cards the learner made. Every shipped deck: a session picks one by its cards (`deckIdOfCard`). */
export const selectNotes = createSelector([(state: RootState) => state.deck.notes], (made): readonly VocabNote[] => [
  ...SHIPPED_DECKS.flatMap(deck => deck.notes),
  ...made,
]);
