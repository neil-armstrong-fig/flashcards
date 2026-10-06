import {selectCards} from "@src/redux/slices/deck/selectors/SelectCards";
import {strugglingRowsOf} from "@src/redux/shared/struggling/StrugglingRowsOf";
import type {RootState} from "@src/redux/Store";

/** How many cards are on the Struggling list. */
export function selectStrugglingCount(state: RootState): number {
  return strugglingRowsOf({
    cards: selectCards(state),
    states: state.study.cards,
    log: state.study.log,
    threshold: state.settings.strugglingAfter,
  }).length;
}
