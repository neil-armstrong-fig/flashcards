import {CARD_DIRECTIONS} from "@flashcards/content/CardDirection";
import {cardOfNote} from "@flashcards/content/cards/CardOfNote";
import type {Deck} from "@flashcards/content/types/Deck";
import type {DeckCard} from "@flashcards/content/types/DeckCard";

/**
 * Every card of a deck, in the order new ones are introduced: all the words one way, then all of them the other. A word's
 * two cards are never next to each other, so seeing one is not the answer to the other.
 */
export function cardsOfDeck(deck: Deck): DeckCard[] {
  return CARD_DIRECTIONS.flatMap(direction => deck.notes.map(note => cardOfNote(note, direction)));
}
