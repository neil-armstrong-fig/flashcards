import type {CardState} from "@src/spaced-repetition/card/types/CardState";

/** The card hidden until the learner brings it back. */
export function suspendCard(state: CardState): CardState {
  return {...state, suspended: true};
}
