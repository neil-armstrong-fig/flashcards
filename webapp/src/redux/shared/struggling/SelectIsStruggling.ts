import {isStruggling} from "@src/spaced-repetition/card/IsStruggling";
import type {RootState} from "@src/redux/Store";

/** Whether the card is on the Struggling list now, for any reason. */
export function selectIsStruggling(state: RootState, cardId: string): boolean {
  const card = state.study.cards[cardId];

  if (!card) {
    return false;
  }

  const answers = state.study.log.filter(entry => entry.cardId === cardId);

  return isStruggling(card, answers, state.settings.strugglingAfter);
}
