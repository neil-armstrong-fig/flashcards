import {aheadSessionCards} from "@src/redux/slices/study/queue/AheadSession";
import {deckStudyOf} from "@src/redux/slices/study/queue/DeckStudy";
import {WHOLE_DECK} from "@src/redux/slices/study/queue/WholeDeck";
import {nextCard} from "@src/spaced-repetition/queue/NextCard";
import type {QueueSettings} from "@src/spaced-repetition/queue/types/QueueSettings";
import type {SessionFocus} from "@src/redux/slices/study/types/SessionFocus";
import type {StudyCard} from "@src/spaced-repetition/card/types/StudyCard";
import type {StudyState} from "@src/redux/slices/study/types/StudyState";

/** The card to show next in a deck's session (within its focus), or `undefined` when that deck's work for today is done. */
export function nextStudyCard(
  state: StudyState,
  deckId: string,
  settings: QueueSettings,
  focus: SessionFocus = WHOLE_DECK,
): StudyCard | undefined {
  if (focus.kind === "ahead") {
    const seen = new Set(state.session?.previewed ?? []);

    return aheadSessionCards(state, deckId).find(card => !seen.has(card.id));
  }

  const {cards, log} = deckStudyOf(state, deckId, focus);

  return nextCard(cards, log, new Date(state.now), settings);
}
