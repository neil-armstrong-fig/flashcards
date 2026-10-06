import {cardsAhead} from "@src/spaced-repetition/queue/due/CardsAhead";
import {deckStudyOf} from "@src/redux/slices/study/queue/DeckStudy";
import {LOOK_AHEAD_SIZE} from "@src/redux/slices/study/queue/look-ahead/LookAheadSize";
import {WHOLE_DECK} from "@src/redux/slices/study/queue/WholeDeck";
import type {StudyCard} from "@src/spaced-repetition/card/types/StudyCard";
import type {StudyState} from "@src/redux/slices/study/types/StudyState";

/**
 * The cards a look ahead at a deck holds, soonest first. A look ahead changes no card, so the list is the same for the whole
 * session, and what has been looked at is told apart by the session's `previewed` ids.
 */
export function aheadSessionCards(state: StudyState, deckId: string): StudyCard[] {
  const {cards} = deckStudyOf(state, deckId, WHOLE_DECK);

  return cardsAhead(cards, new Date(state.now), LOOK_AHEAD_SIZE);
}
