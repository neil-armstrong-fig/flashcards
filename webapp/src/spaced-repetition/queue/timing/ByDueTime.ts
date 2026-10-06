import {dueTime} from "@src/spaced-repetition/queue/timing/DueTime";
import type {StudyCard} from "@src/spaced-repetition/card/types/StudyCard";

/** Sorts the card that has waited longest first. */
export function byDueTime(first: StudyCard, second: StudyCard): number {
  return dueTime(first) - dueTime(second);
}
