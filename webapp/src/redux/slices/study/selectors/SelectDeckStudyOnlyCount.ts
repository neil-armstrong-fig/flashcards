import {cardsDueToday} from "@src/spaced-repetition/queue/due/CardsDueToday";
import {deckStudyOf} from "@src/redux/slices/study/queue/DeckStudy";
import {queueSettingsOf} from "@src/redux/slices/study/queue/QueueSettingsOf";
import type {RootState} from "@src/redux/Store";
import type {StudyFocus} from "@flashcards/shared/study/StudyFocus";

/** How many cards a session on part of a deck would hold today: the same day's work as the whole deck's, narrowed to its new cards or its struggling ones. */
export function selectDeckStudyOnlyCount(state: RootState, deckId: string, focus: StudyFocus): number {
  const {cards, log} = deckStudyOf(state.study, deckId, {kind: focus, strugglingAfter: state.settings.strugglingAfter});

  return cardsDueToday(cards, log, new Date(state.study.now), queueSettingsOf(state.settings, deckId)).length;
}
