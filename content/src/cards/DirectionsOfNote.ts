import {CARD_DIRECTIONS} from "@flashcards/content/CardDirection";
import type {CardDirection} from "@flashcards/content/CardDirection";
import type {VocabNote} from "@flashcards/content/types/VocabNote";

/** The directions a note is studied in: both, except a pronunciation or a sounds-alike pair, which have nothing to say in English: the first is read from its spelling, the second heard. */
export function directionsOfNote(note: VocabNote): readonly CardDirection[] {
  if (note.kind === "pronunciation" || note.kind === "sounds-alike") {
    return ["to-english"];
  }

  return CARD_DIRECTIONS;
}
