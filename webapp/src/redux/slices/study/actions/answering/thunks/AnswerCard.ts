import {answered, savingStarted} from "@src/redux/slices/study/StudySlice";
import {queueSettingsOf} from "@src/redux/slices/study/queue/QueueSettingsOf";
import {reportUnsaved} from "@src/redux/slices/study/actions/shared/utils/ReportUnsaved";
import type {AppThunk} from "@src/redux/shared/AppThunk";
import type {Rating} from "@flashcards/shared/study/Rating";
import type {StudyCard} from "@src/spaced-repetition/card/types/StudyCard";
import {reviewCard} from "@src/spaced-repetition/scheduling/ReviewCard";
import {setAsideIfStruggling} from "@src/redux/slices/study/actions/answering/utils/SetAsideIfStruggling";
import {recordAnswer} from "@src/redux/slices/study/storage/RecordAnswer";

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
    await recordAnswer({id, state: outcome.state}, outcome.log).catch(reportUnsaved);
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
