import {cardsReviewedToday} from "@src/spaced-repetition/queue/done-today/CardsReviewedToday";
import type {RootState} from "@src/redux/Store";

/** How many different cards the learner has answered today. */
export function selectCardsReviewedToday(state: RootState): number {
  const {log, now} = state.study;

  return cardsReviewedToday(log, new Date(now));
}
