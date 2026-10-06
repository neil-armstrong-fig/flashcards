import {CARD_DIRECTIONS} from "@flashcards/content/CardDirection";
import {cardOfNote} from "@flashcards/content/cards/CardOfNote";
import type {DeckCard} from "@flashcards/content/types/DeckCard";
import type {VocabNote} from "@flashcards/content/types/VocabNote";

/** Both cards of one note, in the order of `CARD_DIRECTIONS`: for a note added after its deck was made. */
export function cardsOfNote(note: VocabNote): DeckCard[] {
  return CARD_DIRECTIONS.map(direction => cardOfNote(note, direction));
}
