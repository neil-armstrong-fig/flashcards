import {noteEdited} from "@src/redux/slices/deck/DeckSlice";
import {noteRecord} from "@src/redux/shared/sync-records/builders/NoteRecord";
import {recordLocalChange} from "@src/redux/shared/sync-records/RecordLocalChange";
import type {AppThunk} from "@src/redux/shared/AppThunk";
import type {CardWords} from "@src/redux/slices/deck/types/CardWords";
import type {VocabNote} from "@flashcards/content/types/VocabNote";

/**
 * Changes a card the learner made, and records the change to be sent online the next time the app syncs. The card keeps its id, so both
 * of its directions keep the progress made on them, and its similars stay. The words are those `startEditCustomNote` checked, whose
 * new recordings are already kept. Resolves to whether the card was changed.
 */
export function editCustomNote(noteId: string, words: CardWords): AppThunk<Promise<boolean>> {
  return async dispatch => {
    const {word, meaning, romanisation} = words;
    const note: VocabNote = {id: noteId, language: "ko", word, meaning, romanisation};

    dispatch(noteEdited(note));
    await dispatch(recordLocalChange(noteRecord({...note, at: new Date().toISOString()})));

    return true;
  };
}
