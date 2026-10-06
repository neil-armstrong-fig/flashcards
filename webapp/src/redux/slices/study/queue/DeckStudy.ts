import {deckIdOfCard} from "@src/redux/slices/deck/ids/DeckIdOfCard";
import {focusedCards} from "@src/redux/slices/study/queue/focus/FocusedCards";
import {WHOLE_DECK} from "@src/redux/slices/study/queue/WholeDeck";
import {studyCardsOf} from "@src/redux/slices/study/queue/study-cards/StudyCardsOf";
import type {ReviewLogEntry} from "@src/spaced-repetition/scheduling/types/ReviewLogEntry";
import type {SessionFocus} from "@src/redux/slices/study/types/SessionFocus";
import type {StudyCard} from "@src/spaced-repetition/card/types/StudyCard";
import type {StudyState} from "@src/redux/slices/study/types/StudyState";

/** One deck's cards, in deck order, and the answers given to them: the whole world its limits and its session see. */
export interface DeckStudy {
  readonly cards: readonly StudyCard[];
  readonly log: readonly ReviewLogEntry[];
}

export function deckStudyOf(state: StudyState, deckId: string, focus: SessionFocus = WHOLE_DECK): DeckStudy {
  const log = state.log.filter(entry => deckIdOfCard(entry.cardId) === deckId);
  const cards = studyCardsOf(state).filter(card => deckIdOfCard(card.id) === deckId);

  return {cards: focusedCards(cards, log, focus), log};
}
