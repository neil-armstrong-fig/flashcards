import {byDueTime} from "@src/spaced-repetition/queue/timing/ByDueTime";
import {dueTime} from "@src/spaced-repetition/queue/timing/DueTime";
import {isAvailable} from "@src/spaced-repetition/queue/timing/IsAvailable";
import {isBeingLearned} from "@src/spaced-repetition/queue/timing/IsBeingLearned";
import {studyDayEnd} from "@src/spaced-repetition/day/StudyDayEnd";
import {reviewsDone} from "@src/spaced-repetition/queue/done-today/ReviewsDone";
import {newCardsIntroduced} from "@src/spaced-repetition/queue/done-today/NewCardsIntroduced";
import type {QueueSettings} from "@src/spaced-repetition/queue/types/QueueSettings";
import type {ReviewLogEntry} from "@src/spaced-repetition/scheduling/types/ReviewLogEntry";
import type {StudyCard} from "@src/spaced-repetition/card/types/StudyCard";

/**
 * Everything the learner has to do in the study day `now` falls in: cards being learned, reviews due by the end of the day (up to the day's review limit, soonest first),
 * and as many new cards as the day's allowance has left, in the order the deck lists them.
 */
export function cardsDueToday(
  cards: readonly StudyCard[],
  log: readonly ReviewLogEntry[],
  now: Date,
  settings: QueueSettings,
): StudyCard[] {
  const endOfDay = studyDayEnd(now).getTime();
  const available = cards.filter(card => isAvailable(card, now));
  const newCardsLeft = Math.max(0, settings.newCardsPerDay - newCardsIntroduced(log, now));

  const learning = available.filter(card => isBeingLearned(card) && dueTime(card) <= endOfDay);
  const reviewsLeft = Math.max(0, settings.maxReviewsPerDay - reviewsDone(log, now));
  const reviews = available
    .filter(card => card.state.phase === "review" && dueTime(card) <= endOfDay)
    .sort(byDueTime)
    .slice(0, reviewsLeft);
  const brandNew = available.filter(card => card.state.phase === "new").slice(0, newCardsLeft);

  return [...learning.sort(byDueTime), ...reviews, ...brandNew];
}
