import {editFailed, noteEdited} from "@src/redux/slices/deck/DeckSlice";
import type {AppThunk} from "@src/redux/shared/AppThunk";
import type {CardWords} from "@src/redux/slices/deck/types/CardWords";
import type {VocabNote} from "@flashcards/content/types/VocabNote";
import {editKeptNote} from "@src/redux/api/EditKeptNote";

/**
 * Changes a card the learner made online, and only then here. The card keeps its id, so both of its directions keep the progress made
 * on them, and its similars stay. The words are those `startEditCustomNote` checked, whose new recordings are already kept. Resolves to
 * whether the card was changed.
 */
export function editCustomNote(noteId: string, words: CardWords): AppThunk<Promise<boolean>> {
  return async dispatch => {
    const {word, meaning, romanisation} = words;
    const note: VocabNote = {id: noteId, language: "ko", word, meaning, romanisation};

    try {
      await editKeptNote({id: noteId, word, meaning, romanisation});
    } catch (error) {
      console.error("A card could not be changed.", error);
      dispatch(editFailed("Could not keep the change online. Check your connection and try again."));

      return false;
    }

    dispatch(noteEdited(note));

    return true;
  };
}
