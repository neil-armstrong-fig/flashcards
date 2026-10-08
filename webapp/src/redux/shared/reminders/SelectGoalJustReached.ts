import {selectCardsReviewedToday} from "@src/redux/slices/study/selectors/SelectCardsReviewedToday";
import type {RootState} from "@src/redux/Store";

/**
 * Whether the answer just given brought the learner to their daily goal, with a reminder to be told it is no longer wanted. An answer adds at
 * most one different card to today's count, so the count meets the goal once: later answers are past it.
 */
export function selectGoalJustReached(state: RootState): boolean {
  const {reminderEnabled, dailyGoalCards} = state.settings;

  return reminderEnabled && selectCardsReviewedToday(state) === dailyGoalCards;
}
