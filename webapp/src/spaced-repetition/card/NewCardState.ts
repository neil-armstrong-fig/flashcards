import type {CardState} from "@src/spaced-repetition/card/types/CardState";

/** Due from the beginning of time, so a card built with no `due` is due whenever it is asked. */
const BEFORE_ANY_REVIEW = "1970-01-01T00:00:00.000Z";

/**
 * The state of a card nobody has studied yet, which is due from the moment it exists: give `due` that moment. Any field can be given
 * instead of its default, so a test builds the card it is about, in the phase and with the lapses it needs, by naming only those.
 */
export function newCardState({
  phase = "new",
  due = BEFORE_ANY_REVIEW,
  stability = 0,
  difficulty = 0,
  scheduledDays = 0,
  learningSteps = 0,
  reps = 0,
  lapses = 0,
  suspended = false,
  ...optional
}: Partial<CardState> = {}): CardState {
  return {phase, due, stability, difficulty, scheduledDays, learningSteps, reps, lapses, suspended, ...optional};
}
