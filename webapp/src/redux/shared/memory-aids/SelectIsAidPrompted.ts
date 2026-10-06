import {selectIsStruggling} from "@src/redux/shared/struggling/SelectIsStruggling";
import type {RootState} from "@src/redux/Store";

/** Whether the card on screen should ask for a note or picture: it is struggling and has neither. Derived, never stored. */
export function selectIsAidPrompted(state: RootState): boolean {
  const cardId = state.study.session?.currentCardId;

  if (cardId === undefined || !selectIsStruggling(state, cardId)) {
    return false;
  }

  return state.cardNotes.byCard[cardId] === undefined && state.cardPictures.byCard[cardId] === undefined;
}
