import {studyDayKey} from "@src/spaced-repetition/day/StudyDayKey";
import type {ReviewLogEntry} from "@src/spaced-repetition/scheduling/types/ReviewLogEntry";

/** How many new cards were first answered during the study day `now` falls in. */
export function newCardsIntroduced(log: readonly ReviewLogEntry[], now: Date): number {
  const today = studyDayKey(now);

  return log.filter(entry => entry.phaseBefore === "new" && studyDayKey(new Date(entry.reviewedAt)) === today).length;
}
