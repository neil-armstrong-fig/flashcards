import {newCardState} from "@src/spaced-repetition/card/NewCardState";
import {openedStudyStore} from "@src/testing/OpenedStudyStore";
import {progressSynced} from "@src/redux/slices/study/StudySlice";
import {selectCardsDueToday} from "@src/redux/slices/study/selectors/SelectCardsDueToday";
import {TEST_NOW} from "@src/testing/time/TestNow";
import type {ReviewLogEntry} from "@src/spaced-repetition/scheduling/types/ReviewLogEntry";

function answer(reviewedAt: Date, phaseBefore: ReviewLogEntry["phaseBefore"]): ReviewLogEntry {
  return {
    cardId: "ko-vocab-water/to-english",
    rating: "good",
    phaseBefore,
    reviewedAt: reviewedAt.toISOString(),
    scheduledDays: 5,
    due: reviewedAt.toISOString(),
  };
}

it("counts a card two devices answered once as introduced once, whichever of the two answers was first", async () => {
  const {store} = await openedStudyStore();
  const mine = answer(new Date(TEST_NOW.getTime() + 60_000), "new");
  const theirs = answer(TEST_NOW, "new");
  const reviewed = newCardState({phase: "review", due: "2026-10-12T10:00:00.000Z"});

  store.dispatch(progressSynced({cards: {[mine.cardId]: reviewed}, log: [mine]}));
  const before = selectCardsDueToday(store.getState());

  // Worked out together, the other device's answer came first: this device's was an answer to a card already introduced.
  store.dispatch(
    progressSynced({cards: {[mine.cardId]: reviewed}, log: [theirs, answer(new Date(mine.reviewedAt), "review")]}),
  );

  expect(selectCardsDueToday(store.getState())).toBe(before);
  expect(store.getState().study.log.filter(entry => entry.phaseBefore === "new")).toHaveLength(1);
});
