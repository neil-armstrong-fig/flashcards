import {DECK_STORAGE_KEY} from "@src/redux/slices/deck/storage/DeckStorageKey";
import {INITIAL_DECK_STATE} from "@src/redux/slices/deck/initial-state/InitialDeckState";
import {readCustomNote} from "@src/redux/slices/deck/storage/ReadCustomNote";
import {readJson} from "@src/redux/shared/device-storage/ReadJson";
import type {DeckState} from "@src/redux/slices/deck/types/DeckState";
import type {VocabNote} from "@language-learning/content/types/VocabNote";

/** The cards the learner made, kept on this device. What is stored is untrusted: a card that does not check out is dropped. */
export function loadDeck(): DeckState {
  const stored = readJson(DECK_STORAGE_KEY);

  if (typeof stored !== "object" || stored === null) {
    return INITIAL_DECK_STATE;
  }

  const storedNotes: unknown = Reflect.get(stored, "notes");

  if (!Array.isArray(storedNotes)) {
    return INITIAL_DECK_STATE;
  }

  const notes: VocabNote[] = [];

  for (const value of storedNotes as unknown[]) {
    const note = readCustomNote(value);

    if (note && !notes.some(each => each.id === note.id)) {
      notes.push(note);
    }
  }

  return {...INITIAL_DECK_STATE, notes};
}
