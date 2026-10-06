import {cardMarkedHard} from "@src/redux/slices/study/StudySlice";
import {markHard} from "@src/spaced-repetition/card/setting-aside/MarkHard";
import {reportUnsaved} from "@src/redux/slices/study/actions/shared/utils/ReportUnsaved";
import type {AppThunk} from "@src/redux/shared/AppThunk";
import {saveCard} from "@src/redux/slices/study/storage/SaveCard";

/** Marks the card on screen as hard, so it is on the Struggling list now. The card stays on screen to be answered. Saved before the screen shows it. */
export function markCardHard(): AppThunk<Promise<void>> {
  return async (dispatch, getState) => {
    const {session, cards} = getState().study;
    const id = session?.currentCardId;
    const state = id ? cards[id] : undefined;

    if (!id || !state || session?.saving) {
      return;
    }

    const card = {id, state: markHard(state, new Date())};

    await saveCard(card).catch(reportUnsaved);
    dispatch(cardMarkedHard(card));
  };
}
