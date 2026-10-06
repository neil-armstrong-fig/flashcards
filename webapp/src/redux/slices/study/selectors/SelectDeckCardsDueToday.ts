import {cardsDueToday} from "@src/spaced-repetition/queue/due/CardsDueToday";
import {deckStudyOf} from "@src/redux/slices/study/queue/DeckStudy";
import {queueSettingsOf} from "@src/redux/slices/study/queue/QueueSettingsOf";
import type {RootState} from "@src/redux/Store";

/** How many cards of one deck are waiting today: reviews, cards being learned, and the new cards the deck's allowance leaves. */
export function selectDeckCardsDueToday(state: RootState, deckId: string): number {
  const {cards, log} = deckStudyOf(state.study, deckId);

  return cardsDueToday(cards, log, new Date(state.study.now), queueSettingsOf(state.settings, deckId)).length;
}
