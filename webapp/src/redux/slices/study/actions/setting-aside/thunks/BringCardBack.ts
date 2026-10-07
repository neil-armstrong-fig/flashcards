import {reportUnsaved} from "@src/redux/slices/study/actions/shared/utils/ReportUnsaved";
import {suspendedCardsRestored} from "@src/redux/slices/study/StudySlice";
import {unsuspendCard} from "@src/spaced-repetition/card/setting-aside/UnsuspendCard";
import type {AppThunk} from "@src/redux/shared/AppThunk";
import {saveCard} from "@src/redux/slices/study/storage/SaveCard";

/** Brings one suspended card back, picking up its schedule where it left off. Saved before the screen changes. */
export function bringCardBack(id: string): AppThunk<Promise<void>> {
  return async (dispatch, getState) => {
    const state = getState().study.cards[id];

    if (!state?.suspended) {
      return;
    }

    const restored = unsuspendCard(state);

    await saveCard({id, state: restored}, {cardId: id, kind: "unsuspend", at: new Date().toISOString()}).catch(
      reportUnsaved,
    );
    dispatch(suspendedCardsRestored({[id]: restored}));
  };
}
