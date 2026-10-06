import {markCardHard} from "@src/redux/slices/study/actions/setting-aside/thunks/MarkCardHard";
import {openedStudyStore} from "@src/testing/OpenedStudyStore";
import {TEST_NOW} from "@src/testing/time/TestNow";
import {selectStrugglingCount} from "@src/redux/shared/struggling/SelectStrugglingCount";

it("puts the card on screen on the Struggling list, saved, and leaves it on screen", async () => {
  const {store, storage} = await openedStudyStore();
  const id = store.getState().study.session?.currentCardId ?? "";

  await store.dispatch(markCardHard());

  expect(store.getState().study.cards[id]?.markedHardAt).toBe(TEST_NOW.toISOString());
  expect((await storage.load()).cards[id]?.markedHardAt).toBe(TEST_NOW.toISOString());
  expect(store.getState().study.session?.currentCardId).toBe(id);
  expect(selectStrugglingCount(store.getState())).toBe(1);
});

it("does nothing when no card is on screen", async () => {
  const {store} = await openedStudyStore();

  store.dispatch({type: "study/sessionEnded"});
  await store.dispatch(markCardHard());

  expect(selectStrugglingCount(store.getState())).toBe(0);
});
