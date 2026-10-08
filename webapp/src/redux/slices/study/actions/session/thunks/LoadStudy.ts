import {loaded} from "@src/redux/slices/study/StudySlice";
import {selectCards} from "@src/redux/slices/deck/selectors/SelectCards";
import type {AppThunk} from "@src/redux/shared/AppThunk";
import type {StoredStudy} from "@src/storage/index-db/study/types/StoredStudy";
import {loadStoredStudy} from "@src/storage/index-db/study/LoadStoredStudy";

/** Reads saved progress and makes the app ready. A database that cannot be read leaves the learner studying without saving. */
export function loadStudy(): AppThunk<Promise<void>> {
  return async (dispatch, getState) => {
    const stored = await loadStoredStudy().catch((error: unknown): StoredStudy => {
      console.error("Saved progress could not be read; carrying on without it.", error);
      return {cards: {}, log: []};
    });

    dispatch(loaded({stored, deckOrder: selectCards(getState()).map(card => card.id), now: new Date().toISOString()}));
  };
}
