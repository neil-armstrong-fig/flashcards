import {cardsDueToday} from "@src/spaced-repetition/queue/due/CardsDueToday";
import {deckStudyOf} from "@src/redux/slices/study/queue/DeckStudy";
import {dueCountsOf} from "@src/spaced-repetition/queue/due/DueCountsOf";
import {queueSettingsOf} from "@src/redux/slices/study/queue/QueueSettingsOf";
import type {DueCounts} from "@src/spaced-repetition/queue/types/DueCounts";
import type {RootState} from "@src/redux/Store";

/** What is waiting in one deck today, split into new cards, cards being learned and reviews, within the deck's own limits. */
export function selectDeckDueCounts(state: RootState, deckId: string): DueCounts {
  const {cards, log} = deckStudyOf(state.study, deckId);

  return dueCountsOf(cardsDueToday(cards, log, new Date(state.study.now), queueSettingsOf(state.settings, deckId)));
}
