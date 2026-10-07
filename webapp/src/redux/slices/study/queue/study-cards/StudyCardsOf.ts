import {newCardState} from "@src/spaced-repetition/card/NewCardState";
import type {StudyCard} from "@src/spaced-repetition/card/types/StudyCard";
import type {StudyState} from "@src/redux/slices/study/types/StudyState";

/** The deck's cards in deck order, each with what is known of it. A card nobody has answered is new. */
export function studyCardsOf(state: StudyState): StudyCard[] {
  return state.cardOrder.map(id => ({id, state: state.cards[id] ?? newCardState({due: state.now})}));
}
