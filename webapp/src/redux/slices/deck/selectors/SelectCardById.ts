import {selectCardsById} from "@src/redux/slices/deck/selectors/SelectCardsById";
import type {DeckCard} from "@language-learning/content/types/DeckCard";
import type {RootState} from "@src/redux/Store";

/** A card of the deck being studied by its id, or `undefined` for none, or for one it does not have (a card the learner has deleted, say). */
export function selectCardById(state: RootState, id: string | undefined): DeckCard | undefined {
  if (!id) {
    return undefined;
  }

  return selectCardsById(state).get(id);
}
