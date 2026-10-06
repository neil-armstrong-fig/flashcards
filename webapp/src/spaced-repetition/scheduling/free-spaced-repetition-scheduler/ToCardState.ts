import {State} from "ts-fsrs";
import type {Card} from "ts-fsrs";
import type {CardPhase} from "@src/spaced-repetition/card/CardPhase";
import type {CardState} from "@src/spaced-repetition/card/types/CardState";

const PHASE_OF_STATE: Record<State, CardPhase> = {
  [State.New]: "new",
  [State.Learning]: "learning",
  [State.Review]: "review",
  [State.Relearning]: "relearning",
};

/** The library's card as our plain state, ready to store. What the library knows nothing of (suspended, buried, marked hard) is kept from `previous`. */
export function toCardState(card: Card, previous: CardState): CardState {
  return {
    phase: PHASE_OF_STATE[card.state],
    due: card.due.toISOString(),
    stability: card.stability,
    difficulty: card.difficulty,
    scheduledDays: card.scheduled_days,
    learningSteps: card.learning_steps,
    reps: card.reps,
    lapses: card.lapses,
    lastReview: card.last_review?.toISOString(),
    suspended: previous.suspended,
    markedHardAt: previous.markedHardAt,
    buriedUntil: previous.buriedUntil,
  };
}
