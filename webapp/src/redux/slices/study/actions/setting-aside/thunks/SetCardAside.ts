import {buryCard} from "@src/spaced-repetition/card/setting-aside/BuryCard";
import {cardSetAside, savingStarted} from "@src/redux/slices/study/StudySlice";
import {queueSettingsOf} from "@src/redux/slices/study/queue/QueueSettingsOf";
import {reportUnsaved} from "@src/redux/slices/study/actions/shared/utils/ReportUnsaved";
import {studyDayEnd} from "@src/spaced-repetition/day/StudyDayEnd";
import {suspendCard} from "@src/spaced-repetition/card/setting-aside/SuspendCard";
import type {AppThunk} from "@src/redux/shared/AppThunk";
import type {AsideKind} from "@src/redux/slices/study/types/AsideKind";
import type {CardEvent} from "@flashcards/shared/sync/card-events/CardEvent";
import type {CardState} from "@src/spaced-repetition/card/types/CardState";
import {saveCard} from "@src/storage/index-db/study/SaveCard";

/**
 * Hides the card on screen without answering it: a buried card comes back with tomorrow's study day, a suspended one when the
 * learner brings it back. Saved before the card moves on, like an answer.
 */
export function setCardAside(kind: AsideKind): AppThunk<Promise<void>> {
  return async (dispatch, getState) => {
    const {session, cards} = getState().study;
    const id = session?.currentCardId;
    const cardState = id ? cards[id] : undefined;

    if (!id || !cardState || session?.saving) {
      return;
    }

    const now = new Date();
    const card = {id, state: hiddenState(cardState, kind, now)};

    dispatch(savingStarted());
    await saveCard(card, asideEvent(id, kind, now)).catch(reportUnsaved);
    dispatch(
      cardSetAside({
        card,
        now: now.toISOString(),
        queueSettings: queueSettingsOf(getState().settings, session?.deckId ?? ""),
      }),
    );
  };
}

function asideEvent(cardId: string, kind: AsideKind, now: Date): CardEvent {
  if (kind === "bury") {
    return {cardId, kind: "bury", at: now.toISOString(), until: studyDayEnd(now).toISOString()};
  }

  return {cardId, kind: "suspend", at: now.toISOString()};
}

function hiddenState(state: CardState, kind: AsideKind, now: Date): CardState {
  if (kind === "bury") {
    return buryCard(state, studyDayEnd(now));
  }

  return suspendCard(state);
}
