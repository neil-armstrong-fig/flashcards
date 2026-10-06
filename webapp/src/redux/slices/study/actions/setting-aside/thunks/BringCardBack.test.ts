import {bringCardBack} from "@src/redux/slices/study/actions/setting-aside/thunks/BringCardBack";
import {openedStudyStore} from "@src/testing/OpenedStudyStore";
import {suspendCard} from "@src/spaced-repetition/card/setting-aside/SuspendCard";
import type {OpenedStudyStore} from "@src/testing/OpenedStudyStore";
import {suspendedCardsRestored} from "@src/redux/slices/study/StudySlice";

async function storeWithASuspendedCard(): Promise<OpenedStudyStore & {readonly id: string}> {
  const opened = await openedStudyStore();
  const [id = ""] = Object.keys(opened.store.getState().study.cards);
  const state = opened.store.getState().study.cards[id];

  if (state) {
    opened.store.dispatch(suspendedCardsRestored({[id]: suspendCard(state)}));
  }

  return {...opened, id};
}

it("brings back only the card asked for, and saves it", async () => {
  const {store, id, storage} = await storeWithASuspendedCard();
  const [, other = ""] = Object.keys(store.getState().study.cards);

  await store.dispatch(bringCardBack(id));

  expect(store.getState().study.cards[id]?.suspended).toBe(false);
  expect(store.getState().study.cards[other]?.suspended).toBe(false);
  expect((await storage.load()).cards[id]?.suspended).toBe(false);
});

it("does nothing for a card that is not suspended", async () => {
  const {store, storage} = await openedStudyStore();
  const [id = ""] = Object.keys(store.getState().study.cards);

  await store.dispatch(bringCardBack(id));

  expect((await storage.load()).cards[id]).toBeUndefined();
});
