import {byDueTime} from "@src/spaced-repetition/queue/timing/ByDueTime";
import {dueTime} from "@src/spaced-repetition/queue/timing/DueTime";
import {isAvailable} from "@src/spaced-repetition/queue/timing/IsAvailable";
import {studyDayEnd} from "@src/spaced-repetition/day/StudyDayEnd";
import type {StudyCard} from "@src/spaced-repetition/card/types/StudyCard";

/**
 * The reviews that are not due until a later study day, soonest first, up to `count`: what a learner may look at early.
 * Looking changes nothing, so only the cards that are settled in their schedule qualify (never new or still being learned),
 * and never one that is suspended or buried.
 */
export function cardsAhead(cards: readonly StudyCard[], now: Date, count: number): StudyCard[] {
  const endOfDay = studyDayEnd(now).getTime();

  return cards
    .filter(card => isAvailable(card, now) && card.state.phase === "review" && dueTime(card) > endOfDay)
    .sort(byDueTime)
    .slice(0, count);
}
