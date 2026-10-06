import {cardsOfNote} from "@language-learning/content/cards/CardsOfNote";
import {cardsAdded} from "@src/redux/slices/study/StudySlice";
import {noteAdded, noteEdited} from "@src/redux/slices/deck/DeckSlice";
import type {AppThunk} from "@src/redux/shared/AppThunk";
import type {KeptNote} from "@src/redux/slices/account/types/KeptNote";
import type {VocabNote} from "@language-learning/content/types/VocabNote";

/** Puts a card kept online here, once its recordings are on this device: added, studied both ways, if it is new, and changed if its words are. */
export function syncKeptNote({id, word, meaning, romanisation}: KeptNote): AppThunk {
  return (dispatch, getState) => {
    const here = getState().deck.notes.find(note => note.id === id);
    const note: VocabNote = {id, language: "ko", word, meaning, romanisation};

    if (!here) {
      dispatch(noteAdded(note));
      dispatch(cardsAdded({ids: cardsOfNote(note).map(card => card.id), now: new Date().toISOString()}));

      return;
    }

    if (here.word !== word || here.meaning !== meaning || here.romanisation !== romanisation) {
      dispatch(noteEdited(note));
    }
  };
}
