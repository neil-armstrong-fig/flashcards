import {cardsDueToday} from "@src/spaced-repetition/queue/due/CardsDueToday";
import {aheadSessionCards} from "@src/redux/slices/study/queue/AheadSession";
import {deckStudyOf} from "@src/redux/slices/study/queue/DeckStudy";
import {queueSettingsOf} from "@src/redux/slices/study/queue/QueueSettingsOf";
import type {RootState} from "@src/redux/Store";

/** How many cards are left in the session on screen: the deck's work for today, narrowed to what the session studies. 0 when none is open. */
export function selectSessionCardsRemaining(state: RootState): number {
  const {session} = state.study;

  if (!session) {
    return 0;
  }

  if (session.focus.kind === "ahead") {
    return aheadSessionCards(state.study, session.deckId).length - session.previewed.length;
  }

  const {cards, log} = deckStudyOf(state.study, session.deckId, session.focus);

  return cardsDueToday(cards, log, new Date(state.study.now), queueSettingsOf(state.settings, session.deckId)).length;
}
