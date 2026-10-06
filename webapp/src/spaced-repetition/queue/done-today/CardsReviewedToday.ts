import {studyDayKey} from "@src/spaced-repetition/day/StudyDayKey";
import type {ReviewLogEntry} from "@src/spaced-repetition/scheduling/types/ReviewLogEntry";

/** How many different cards were answered during the study day `now` falls in. A card that came back and was answered again counts once. */
export function cardsReviewedToday(log: readonly ReviewLogEntry[], now: Date): number {
  const today = studyDayKey(now);
  const answered = log.filter(entry => studyDayKey(new Date(entry.reviewedAt)) === today);

  return new Set(answered.map(entry => entry.cardId)).size;
}
