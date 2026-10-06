import type {CardState} from "@src/spaced-repetition/card/types/CardState";

/** The card as the learner's own flag for a struggle: it joins the Struggling list at once, and leaves it by good answers from now on. */
export function markHard(state: CardState, now: Date): CardState {
  return {...state, markedHardAt: now.toISOString()};
}
