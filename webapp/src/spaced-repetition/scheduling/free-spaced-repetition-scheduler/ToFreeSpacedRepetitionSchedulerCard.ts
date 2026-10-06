import {State} from "ts-fsrs";
import type {Card} from "ts-fsrs";
import type {CardPhase} from "@src/spaced-repetition/card/CardPhase";
import type {CardState} from "@src/spaced-repetition/card/types/CardState";

const STATE_OF_PHASE: Record<CardPhase, State> = {
  new: State.New,
  learning: State.Learning,
  review: State.Review,
  relearning: State.Relearning,
};

/** Our plain stored state as the library's card. */
export function toFreeSpacedRepetitionSchedulerCard(state: CardState): Card {
  return {
    due: new Date(state.due),
    stability: state.stability,
    difficulty: state.difficulty,
    // Deprecated in ts-fsrs and recomputed from `last_review`; still required by the type.
    elapsed_days: 0,
    scheduled_days: state.scheduledDays,
    learning_steps: state.learningSteps,
    reps: state.reps,
    lapses: state.lapses,
    state: STATE_OF_PHASE[state.phase],
    ...(state.lastReview === undefined ? {} : {last_review: new Date(state.lastReview)}),
  };
}
