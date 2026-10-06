import {selectCardById} from "@src/redux/slices/deck/selectors/SelectCardById";
import {selectNoteById} from "@src/redux/slices/deck/selectors/SelectNoteById";
import type {RootState} from "@src/redux/Store";
import type {ShapeSimilar} from "@language-learning/content/types/ShapeSimilar";

const NONE: readonly ShapeSimilar[] = [];

/** The characters the card on screen is easily taken for by their shape, whichever direction it asks in: both cards of a note share them. */
export function selectCurrentShapeSimilars(state: RootState): readonly ShapeSimilar[] {
  const cardId = state.study.session?.currentCardId;

  if (cardId === undefined) {
    return NONE;
  }

  const card = selectCardById(state, cardId);

  if (card === undefined) {
    return NONE;
  }

  return selectNoteById(state, card.noteId)?.shapeSimilars ?? NONE;
}
