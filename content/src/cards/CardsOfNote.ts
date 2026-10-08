import {cardOfNote} from "@flashcards/content/cards/CardOfNote";
import {directionsOfNote} from "@flashcards/content/cards/DirectionsOfNote";
import type {DeckCard} from "@flashcards/content/types/DeckCard";
import type {VocabNote} from "@flashcards/content/types/VocabNote";

/** The cards of one note, in the order of `CARD_DIRECTIONS` (both, but a pronunciation has one): for a note added after its deck was made. */
export function cardsOfNote(note: VocabNote): DeckCard[] {
  return directionsOfNote(note).map(direction => cardOfNote(note, direction));
}
