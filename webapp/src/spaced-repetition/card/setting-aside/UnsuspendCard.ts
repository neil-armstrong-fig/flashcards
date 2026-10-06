import type {CardState} from "@src/spaced-repetition/card/types/CardState";

/** The card available again. Its schedule is untouched: it picks up where it was. */
export function unsuspendCard(state: CardState): CardState {
  return {...state, suspended: false};
}
