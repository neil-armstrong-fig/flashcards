import {reportUnsaved} from "@src/redux/slices/study/actions/shared/utils/ReportUnsaved";
import {suspendedCardsRestored} from "@src/redux/slices/study/StudySlice";
import {unsuspendCard} from "@src/spaced-repetition/card/setting-aside/UnsuspendCard";
import type {AppThunk} from "@src/redux/shared/AppThunk";
import type {CardState} from "@src/spaced-repetition/card/types/CardState";
import {saveCard} from "@src/storage/index-db/study/SaveCard";

/** Brings every suspended card back, each picking up its schedule where it left off. */
export function unsuspendAll(): AppThunk<Promise<void>> {
  return async (dispatch, getState) => {
    const restored: Record<string, CardState> = {};

    for (const [id, state] of Object.entries(getState().study.cards)) {
      if (state.suspended) {
        restored[id] = unsuspendCard(state);
      }
    }

    const at = new Date().toISOString();

    await Promise.all(
      Object.entries(restored).map(([id, state]) => saveCard({id, state}, {cardId: id, kind: "unsuspend", at})),
    ).catch(reportUnsaved);
    dispatch(suspendedCardsRestored(restored));
  };
}
