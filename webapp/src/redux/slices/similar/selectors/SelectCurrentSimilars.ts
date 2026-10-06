import {createSelector} from "@reduxjs/toolkit";
import {selectCurrentShapeSimilars} from "@src/redux/slices/deck/selectors/SelectCurrentShapeSimilars";
import {selectSimilar} from "@src/redux/slices/similar/selectors/SelectSimilar";
import type {CurrentSimilars} from "@src/redux/slices/similar/types/CurrentSimilars";

/** Every kind of similar for the card on screen: the characters it is easily taken for by shape, and the words it sounds like. */
export const selectCurrentSimilars = createSelector(
  [selectCurrentShapeSimilars, selectSimilar],
  (shape, sound): CurrentSimilars => ({shape, sound}),
);
