import {noteAdded} from "@src/redux/slices/deck/DeckSlice";
import {cardsAdded} from "@src/redux/slices/study/StudySlice";
import {cardsOfNote} from "@flashcards/content/cards/CardsOfNote";
import {customNoteIdOf} from "@src/redux/slices/deck/ids/CustomNoteId";
import {noteRecord} from "@src/redux/shared/sync-records/builders/NoteRecord";
import {recordLocalChange} from "@src/redux/shared/sync-records/RecordLocalChange";
import type {AppThunk} from "@src/redux/shared/AppThunk";
import type {CardWords} from "@src/redux/slices/deck/types/CardWords";
import type {VocabNote} from "@flashcards/content/types/VocabNote";

/**
 * Adds a card the learner made, studied both ways, and records it to be sent online the next time the app syncs, so their other devices
 * find it. It does not wait for the API: the words are those `startCustomNote` checked, whose recordings are already kept. Resolves to
 * whether the card was added.
 */
export function addCustomNote(words: CardWords): AppThunk<Promise<boolean>> {
  return async dispatch => {
    const {word, meaning, romanisation} = words;
    const note: VocabNote = {id: customNoteIdOf(crypto.randomUUID()), language: "ko", word, meaning, romanisation};
    const now = new Date();

    dispatch(noteAdded(note));
    dispatch(cardsAdded({ids: cardsOfNote(note).map(card => card.id), now: now.toISOString()}));
    await dispatch(recordLocalChange(noteRecord({...note, at: now.toISOString()})));

    return true;
  };
}
