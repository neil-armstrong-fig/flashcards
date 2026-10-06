import {selectNotes} from "@src/redux/slices/deck/selectors/SelectNotes";
import type {RootState} from "@src/redux/Store";
import type {VocabNote} from "@language-learning/content/types/VocabNote";

/** A note of the deck being studied by its id, or `undefined` for one it does not have. */
export function selectNoteById(state: RootState, id: string): VocabNote | undefined {
  return selectNotes(state).find(note => note.id === id);
}
