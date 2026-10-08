import {CARD_DIRECTIONS} from "@flashcards/content/CardDirection";
import {cardOfNote} from "@flashcards/content/cards/CardOfNote";
import {directionsOfNote} from "@flashcards/content/cards/DirectionsOfNote";
import type {Deck} from "@flashcards/content/types/Deck";
import type {DeckCard} from "@flashcards/content/types/DeckCard";

/**
 * Every card of a deck, in the order new ones are introduced: all the words one way, then all of them the other. A word's
 * two cards are never next to each other, so seeing one is not the answer to the other. A pronunciation has only the first.
 */
export function cardsOfDeck(deck: Deck): DeckCard[] {
  return CARD_DIRECTIONS.flatMap(direction => {
    const notes = deck.notes.filter(note => directionsOfNote(note).includes(direction));

    return notes.map(note => cardOfNote(note, direction));
  });
}
