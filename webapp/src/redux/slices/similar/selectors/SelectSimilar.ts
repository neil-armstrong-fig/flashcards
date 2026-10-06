import {similarOf} from "@src/redux/slices/similar/similars/SimilarOf";
import {createSelector} from "@reduxjs/toolkit";
import {selectCardsById} from "@src/redux/slices/deck/selectors/SelectCardsById";
import {selectNotes} from "@src/redux/slices/deck/selectors/SelectNotes";
import type {Similar} from "@src/redux/slices/similar/types/Similar";
import type {RootState} from "@src/redux/Store";

/** What the card on screen is compared with, whichever direction it asks in: a word's two cards share their similars. */
export const selectSimilar = createSelector(
  [
    (state: RootState) => state.study.session?.currentCardId,
    (state: RootState) => state.similar.words,
    selectCardsById,
    selectNotes,
  ],
  (cardId, learned, cards, notes): Similar | undefined => {
    if (!cardId) {
      return undefined;
    }

    const card = cards.get(cardId);

    if (!card) {
      return undefined;
    }

    return similarOf(
      notes.find(note => note.id === card.noteId),
      learned[card.noteId],
    );
  },
);
