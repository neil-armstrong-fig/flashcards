import {answered, savingStarted} from "@src/redux/slices/study/StudySlice";
import {queueSettingsOf} from "@src/redux/slices/study/queue/QueueSettingsOf";
import {reportUnsaved} from "@src/redux/slices/study/actions/shared/utils/ReportUnsaved";
import type {AppThunk} from "@src/redux/shared/AppThunk";
import type {AnswerEventsRequest} from "@src/redux/slices/study/actions/answering/types/AnswerEventsRequest";
import type {CardEvent} from "@flashcards/shared/sync/card-events/CardEvent";
import type {Rating} from "@flashcards/shared/study/Rating";
import type {StudyCard} from "@src/spaced-repetition/card/types/StudyCard";
import {reviewCard} from "@src/spaced-repetition/scheduling/ReviewCard";
import {setAsideIfStruggling} from "@src/redux/slices/study/actions/answering/utils/SetAsideIfStruggling";
import {recordAnswer} from "@src/storage/index-db/study/RecordAnswer";

/** Rates the card on screen. The answer is saved before the card moves on, so what is shown is never ahead of what survives. */
export function answerCard(rating: Rating): AppThunk<Promise<void>> {
  return async (dispatch, getState) => {
    const {session, cards} = getState().study;
    const id = session?.currentCardId;
    const cardState = id ? cards[id] : undefined;

    if (!id || !cardState || !session?.answerShown || session.saving) {
      return;
    }

    const previous: StudyCard = {id, state: cardState};
    const now = new Date();
    const desiredRetention = getState().settings.desiredRetentionPercent / 100;
    const reviewed = reviewCard({card: previous, rating, now, desiredRetention});
    const outcome = setAsideIfStruggling(reviewed, previous, getState().settings);

    dispatch(savingStarted());
    await recordAnswer(
      {id, state: outcome.state},
      outcome.log,
      answerEvents({cardId: id, rating, now, retention: desiredRetention, outcome, previous}),
    ).catch(reportUnsaved);
    dispatch(
      answered({
        previous,
        outcome,
        now: now.toISOString(),
        queueSettings: queueSettingsOf(getState().settings, session?.deckId ?? ""),
      }),
    );
  };
}

/** The answer, and a suspend at the same moment when answering it set the card aside, so a replay never has to read the settings. */
function answerEvents({cardId, rating, now, retention, outcome, previous}: AnswerEventsRequest): CardEvent[] {
  const at = now.toISOString();
  const answer: CardEvent = {cardId, kind: "answer", at, rating, retention};

  if (outcome.state.suspended && !previous.state.suspended) {
    return [answer, {cardId, kind: "suspend", at}];
  }

  return [answer];
}
