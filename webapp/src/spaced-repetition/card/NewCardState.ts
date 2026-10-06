import type {CardState} from "@src/spaced-repetition/card/types/CardState";

/** The state of a card nobody has studied yet. A new card is due from the moment it exists. */
export function newCardState(now: Date): CardState {
  return {
    phase: "new",
    due: now.toISOString(),
    stability: 0,
    difficulty: 0,
    scheduledDays: 0,
    learningSteps: 0,
    reps: 0,
    lapses: 0,
    suspended: false,
  };
}
