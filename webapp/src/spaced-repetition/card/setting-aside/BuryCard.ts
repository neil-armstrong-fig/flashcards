import type {CardState} from "@src/spaced-repetition/card/types/CardState";

/** The card hidden until `until`, which is normally the end of today's study day. */
export function buryCard(state: CardState, until: Date): CardState {
  return {...state, buriedUntil: until.toISOString()};
}
