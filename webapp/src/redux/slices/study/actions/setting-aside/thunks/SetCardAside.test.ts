import {openedStudyStore} from "@src/testing/OpenedStudyStore";
import {selectDeckCardsDueToday} from "@src/redux/slices/study/selectors/SelectDeckCardsDueToday";
import {selectSuspendedCount} from "@src/redux/slices/study/selectors/SelectSuspendedCount";
import {setCardAside} from "@src/redux/slices/study/actions/setting-aside/thunks/SetCardAside";
import {unsuspendAll} from "@src/redux/slices/study/actions/setting-aside/thunks/UnsuspendAll";

it("moves on to the next card and leaves the buried one out of today", async () => {
  const {store} = await openedStudyStore();
  const first = store.getState().study.session?.currentCardId;

  await store.dispatch(setCardAside("bury"));

  expect(store.getState().study.session?.currentCardId).not.toBe(first);
  expect(store.getState().study.cards[first ?? ""]?.buriedUntil).toBeDefined();
  expect(selectDeckCardsDueToday(store.getState(), "ko-starter")).toBe(19);
});

it("keeps a suspended card suspended, in storage as well as on screen", async () => {
  const {store, storage} = await openedStudyStore();
  const first = store.getState().study.session?.currentCardId ?? "";

  await store.dispatch(setCardAside("suspend"));

  expect(selectSuspendedCount(store.getState())).toBe(1);
  expect((await storage.load()).cards[first]?.suspended).toBe(true);
});

it("brings every suspended card back, on screen and in storage", async () => {
  const {store, storage} = await openedStudyStore();
  const first = store.getState().study.session?.currentCardId ?? "";
  await store.dispatch(setCardAside("suspend"));

  await store.dispatch(unsuspendAll());

  expect(selectSuspendedCount(store.getState())).toBe(0);
  expect((await storage.load()).cards[first]?.suspended).toBe(false);
});
