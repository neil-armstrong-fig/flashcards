import {isStruggling} from "@src/spaced-repetition/card/IsStruggling";
import type {ReviewLogEntry} from "@src/spaced-repetition/scheduling/types/ReviewLogEntry";
import type {SessionFocus} from "@src/redux/slices/study/types/SessionFocus";
import type {StudyCard} from "@src/spaced-repetition/card/types/StudyCard";

/**
 * The part of a deck's cards a session studies: all of them, only the ones never seen, or only the ones the learner is
 * struggling with. It narrows the cards before today's queue is built, so the day's limits and ordering work as they always do.
 */
export function focusedCards(
  cards: readonly StudyCard[],
  log: readonly ReviewLogEntry[],
  focus: SessionFocus,
): readonly StudyCard[] {
  if (focus.kind === "new") {
    return cards.filter(card => card.state.phase === "new");
  }

  if (focus.kind === "struggling") {
    return cards.filter(card => {
      const history = log.filter(entry => entry.cardId === card.id);

      return isStruggling(card.state, history, focus.strugglingAfter);
    });
  }

  return cards;
}
