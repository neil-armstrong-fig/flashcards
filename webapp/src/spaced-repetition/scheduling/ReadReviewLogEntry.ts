import {CARD_PHASES} from "@src/spaced-repetition/card/CardPhase";
import {RATINGS} from "@language-learning/shared/study/Rating";
import type {ReviewLogEntry} from "@src/spaced-repetition/scheduling/types/ReviewLogEntry";

/** A log entry from storage, or `undefined` if what was stored is not one. */
export function readReviewLogEntry(value: unknown): ReviewLogEntry | undefined {
  if (typeof value !== "object" || value === null) {
    return undefined;
  }

  const {cardId, rating, phaseBefore, reviewedAt, scheduledDays, due} = value as Record<string, unknown>;

  if (
    typeof cardId !== "string" ||
    !RATINGS.some(known => known === rating) ||
    !CARD_PHASES.some(known => known === phaseBefore) ||
    typeof reviewedAt !== "string" ||
    Number.isNaN(new Date(reviewedAt).getTime()) ||
    typeof scheduledDays !== "number" ||
    typeof due !== "string"
  ) {
    return undefined;
  }

  return value as ReviewLogEntry;
}
