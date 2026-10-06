import {aheadSessionCards} from "@src/redux/slices/study/queue/AheadSession";
import type {RootState} from "@src/redux/Store";

/** How many cards a look ahead at the deck would hold: those not due until a later day, up to the size of one look. */
export function selectDeckAheadCount(state: RootState, deckId: string): number {
  return aheadSessionCards(state.study, deckId).length;
}
