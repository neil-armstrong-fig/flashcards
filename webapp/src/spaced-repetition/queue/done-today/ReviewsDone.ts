import {studyDayKey} from "@src/spaced-repetition/day/StudyDayKey";
import type {ReviewLogEntry} from "@src/spaced-repetition/scheduling/types/ReviewLogEntry";

/** How many answers were given today to cards that were already in review: what the day's review limit is spent on. */
export function reviewsDone(log: readonly ReviewLogEntry[], now: Date): number {
  const today = studyDayKey(now);

  return log.filter(entry => entry.phaseBefore === "review" && studyDayKey(new Date(entry.reviewedAt)) === today)
    .length;
}
