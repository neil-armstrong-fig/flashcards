import {CARD_PHASES} from "@src/spaced-repetition/card/CardPhase";
import type {CardPhase} from "@src/spaced-repetition/card/CardPhase";
import type {CardState} from "@src/spaced-repetition/card/types/CardState";

/** A card state from storage, or `undefined` if what was stored is not one. The caller decides what to do about that. */
export function readCardState(value: unknown): CardState | undefined {
  if (typeof value !== "object" || value === null) {
    return undefined;
  }

  const {
    phase,
    due,
    stability,
    difficulty,
    scheduledDays,
    learningSteps,
    reps,
    lapses,
    lastReview,
    suspended,
    markedHardAt,
    buriedUntil,
  } = value as Record<string, unknown>;

  if (
    !isPhase(phase) ||
    !isTimestamp(due) ||
    !isNumber(stability) ||
    !isNumber(difficulty) ||
    !isNumber(scheduledDays) ||
    !isNumber(learningSteps) ||
    !isNumber(reps) ||
    !isNumber(lapses) ||
    !isOptionalTimestamp(lastReview) ||
    !(suspended === undefined || typeof suspended === "boolean") ||
    !isOptionalTimestamp(markedHardAt) ||
    !isOptionalTimestamp(buriedUntil)
  ) {
    return undefined;
  }

  // A card stored before suspending, burying and marking as hard existed has none of those fields: it is none of them. Stored `null`s mean none.
  return {
    phase,
    due,
    stability,
    difficulty,
    scheduledDays,
    learningSteps,
    reps,
    lapses,
    lastReview: lastReview ?? undefined,
    suspended: suspended ?? false,
    markedHardAt: markedHardAt ?? undefined,
    buriedUntil: buriedUntil ?? undefined,
  };
}

function isPhase(value: unknown): value is CardPhase {
  return CARD_PHASES.some(phase => phase === value);
}

function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

/** A timestamp, or nothing: a card stored before a field existed lacks it, and one stored as `null` meant none. */
function isOptionalTimestamp(value: unknown): value is string | undefined | null {
  return value == null || isTimestamp(value);
}

function isTimestamp(value: unknown): value is string {
  return typeof value === "string" && !Number.isNaN(new Date(value).getTime());
}
