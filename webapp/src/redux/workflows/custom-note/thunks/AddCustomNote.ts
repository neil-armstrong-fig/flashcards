import {failed, noteAdded} from "@src/redux/slices/deck/DeckSlice";
import {cardsAdded} from "@src/redux/slices/study/StudySlice";
import {cardsOfNote} from "@language-learning/content/cards/CardsOfNote";
import {customNoteIdOf} from "@src/redux/slices/deck/ids/CustomNoteId";
import type {AppThunk} from "@src/redux/shared/AppThunk";
import type {CardWords} from "@src/redux/slices/deck/types/CardWords";
import type {VocabNote} from "@language-learning/content/types/VocabNote";
import {addKeptNote} from "@src/redux/api/AddKeptNote";

/**
 * Keeps a card the learner made online, and only then adds it here, studied both ways, so another device can always find it. The words
 * are those `startCustomNote` checked, whose recordings are already kept. Resolves to whether the card was added.
 */
export function addCustomNote(words: CardWords): AppThunk<Promise<boolean>> {
  return async dispatch => {
    const {word, meaning, romanisation} = words;
    const note: VocabNote = {id: customNoteIdOf(crypto.randomUUID()), language: "ko", word, meaning, romanisation};

    try {
      await addKeptNote({id: note.id, word, meaning, romanisation});
    } catch (error) {
      console.error("A card could not be made.", error);
      dispatch(failed("Could not keep it online. Check your connection and try again."));

      return false;
    }

    dispatch(noteAdded(note));
    dispatch(cardsAdded({ids: cardsOfNote(note).map(card => card.id), now: new Date().toISOString()}));

    return true;
  };
}
