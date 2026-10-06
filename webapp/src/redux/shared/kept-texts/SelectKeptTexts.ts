import {createSelector} from "@reduxjs/toolkit";
import type {RootState} from "@src/redux/Store";
import type {SpokenText} from "@flashcards/content/types/SpokenText";

/**
 * The texts whose recordings the learner asked for, and so are kept on this device: the Korean and English of each card they
 * made, and each similar word they added. A text not here and not in the manifest has no recording to play.
 */
export const selectKeptTexts = createSelector(
  [(state: RootState) => state.deck.notes, (state: RootState) => state.similar.words],
  (notes, words): readonly SpokenText[] => {
    const kept: SpokenText[] = [];

    for (const note of notes) {
      kept.push({language: "ko", text: note.word}, {language: "en", text: note.meaning});
    }

    for (const texts of Object.values(words)) {
      for (const text of texts) {
        kept.push({language: "ko", text});
      }
    }

    return kept;
  },
);
