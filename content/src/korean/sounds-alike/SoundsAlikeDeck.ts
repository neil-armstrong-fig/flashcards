import {SOUNDS_ALIKE_PAIRS} from "@flashcards/content/korean/sounds-alike/SoundsAlikePairs";
import {notesOfSoundsAlikePair} from "@flashcards/content/korean/sounds-alike/notes/NotesOfSoundsAlikePair";
import type {Deck} from "@flashcards/content/types/Deck";

/**
 * Pairs of Korean words that sound alike. Each pair is two cards with the same text on the front, `바르다/빠르다`; one says the
 * first word and the other the second, and the answer picks out the one that was said and offers the other to compare.
 */
export const SOUNDS_ALIKE_DECK: Deck = {
  id: "ko-sounds-alike",
  name: "Korean sounds alike",
  language: "ko",
  notes: SOUNDS_ALIKE_PAIRS.flatMap(pair => notesOfSoundsAlikePair(pair)),
};
