import {selectCardById} from "@src/redux/slices/deck/selectors/SelectCardById";
import {selectNoteById} from "@src/redux/slices/deck/selectors/SelectNoteById";
import type {RootState} from "@src/redux/Store";

/** Why the card on screen is as it is, as its note says (why a rare kana exists), whichever direction it asks in. Empty when there is none. */
export function selectCurrentExplanation(state: RootState): string {
  const cardId = state.study.session?.currentCardId;

  if (cardId === undefined) {
    return "";
  }

  const card = selectCardById(state, cardId);

  if (card === undefined) {
    return "";
  }

  return selectNoteById(state, card.noteId)?.explanation ?? "";
}
