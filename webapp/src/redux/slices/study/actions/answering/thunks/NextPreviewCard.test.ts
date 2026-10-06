import {answerCard} from "@src/redux/slices/study/actions/answering/thunks/AnswerCard";
import {endSession} from "@src/redux/slices/study/actions/session/thunks/EndSession";
import {newCardsPerDayChosen} from "@src/redux/slices/settings/SettingsSlice";
import {nextPreviewCard} from "@src/redux/slices/study/actions/answering/thunks/NextPreviewCard";
import {openedStudyStore} from "@src/testing/OpenedStudyStore";
import {selectDeckAheadCount} from "@src/redux/slices/study/selectors/SelectDeckAheadCount";
import {selectSessionCardsRemaining} from "@src/redux/slices/study/selectors/SelectSessionCardsRemaining";
import {showAnswer} from "@src/redux/slices/study/actions/answering/thunks/ShowAnswer";
import {startSession} from "@src/redux/slices/study/actions/session/thunks/StartSession";
import type {AppStore} from "@src/redux/Store";

/** A store in which one starter card has been learned easily, so it is a review that falls due on a later day. */
async function storeWithOneCardLearned(): Promise<AppStore> {
  const {store} = await openedStudyStore();

  store.dispatch(newCardsPerDayChosen({deckId: "ko-starter", count: 1}));
  store.dispatch(startSession("ko-starter"));
  store.dispatch(showAnswer());
  await store.dispatch(answerCard("easy"));
  store.dispatch(endSession());

  return store;
}

it("offers the learned card to look at, and nothing in a deck where none is learned", async () => {
  const store = await storeWithOneCardLearned();

  expect(selectDeckAheadCount(store.getState(), "ko-starter")).toBe(1);
  expect(selectDeckAheadCount(store.getState(), "ja-hiragana")).toBe(0);
});

it("moves on from a card without rating it, scheduling it or writing anything down", async () => {
  const store = await storeWithOneCardLearned();
  const before = store.getState().study;

  store.dispatch(startSession("ko-starter", "ahead"));
  store.dispatch(showAnswer());
  store.dispatch(nextPreviewCard());

  const after = store.getState().study;

  expect(after.cards).toEqual(before.cards);
  expect(after.log).toEqual(before.log);
  expect(after.session?.currentCardId).toBeUndefined();
  expect(selectSessionCardsRemaining(store.getState())).toBe(0);
});

it("does not move on before the answer is shown", async () => {
  const store = await storeWithOneCardLearned();

  store.dispatch(startSession("ko-starter", "ahead"));
  store.dispatch(nextPreviewCard());

  expect(store.getState().study.session?.currentCardId).toBeDefined();
});
