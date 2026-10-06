import {CARD_DIRECTIONS} from "@language-learning/content/CardDirection";
import {cardOfNote} from "@language-learning/content/cards/CardOfNote";
import type {DeckCard} from "@language-learning/content/types/DeckCard";
import type {VocabNote} from "@language-learning/content/types/VocabNote";

/** Both cards of one note, in the order of `CARD_DIRECTIONS`: for a note added after its deck was made. */
export function cardsOfNote(note: VocabNote): DeckCard[] {
  return CARD_DIRECTIONS.map(direction => cardOfNote(note, direction));
}
