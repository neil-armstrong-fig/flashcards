import type {RootState} from "@src/redux/Store";

/** How many cards are suspended. */
export function selectSuspendedCount(state: RootState): number {
  return Object.values(state.study.cards).filter(card => card.suspended).length;
}
