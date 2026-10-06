import {createSelector} from "@reduxjs/toolkit";
import {selectCards} from "@src/redux/slices/deck/selectors/SelectCards";
import type {DeckCard} from "@language-learning/content/types/DeckCard";

export const selectCardsById = createSelector(
  [selectCards],
  (cards): ReadonlyMap<string, DeckCard> => new Map(cards.map(card => [card.id, card])),
);
