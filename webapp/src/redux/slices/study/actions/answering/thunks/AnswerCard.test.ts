import {SHIPPED_CARD_COUNT} from "@src/testing/ShippedCardCount";
import {answerCard} from "@src/redux/slices/study/actions/answering/thunks/AnswerCard";
import {openedStudyStore} from "@src/testing/OpenedStudyStore";
import {TEST_NOW} from "@src/testing/time/TestNow";
import {testEnvironment} from "@src/testing/environment/TestEnvironment";
import {newCardState} from "@src/spaced-repetition/card/NewCardState";
import {
  dailyGoalChosen,
  reminderEnabledChosen,
  setAsideWhenStrugglingChosen,
  strugglingAfterChosen,
} from "@src/redux/slices/settings/SettingsSlice";
import type {OpenedStudyStore} from "@src/testing/OpenedStudyStore";
import {showAnswer} from "@src/redux/slices/study/actions/answering/thunks/ShowAnswer";

it("has saved an answer by the time the card moves on", async () => {
  const {store, storage} = await openedStudyStore();
  const firstCard = store.getState().study.session?.currentCardId;

  store.dispatch(showAnswer());
  await store.dispatch(answerCard("easy"));

  expect(store.getState().study.session?.currentCardId).not.toBe(firstCard);
  expect(Object.keys((await storage.load()).cards)).toEqual([firstCard]);
});

it("brings saved progress back when the app is opened again", async () => {
  const {store} = await openedStudyStore();
  store.dispatch(showAnswer());
  await store.dispatch(answerCard("easy"));

  const reopened = await openedStudyStore();

  expect(Object.keys(reopened.store.getState().study.cards)).toHaveLength(SHIPPED_CARD_COUNT);
  expect(reopened.store.getState().study.log).toHaveLength(1);
});

it("ignores an answer given before the answer was shown", async () => {
  const {store} = await openedStudyStore();

  await store.dispatch(answerCard("easy"));

  expect(store.getState().study.log).toEqual([]);
});

describe("a card forgotten for the eighth time", () => {
  async function storeWithACardOneLapseFromStruggling(): Promise<OpenedStudyStore> {
    const {store: first} = await openedStudyStore();
    const id = first.getState().study.session?.currentCardId ?? "";
    const state = {
      ...newCardState({due: TEST_NOW.toISOString()}),
      phase: "review" as const,
      due: new Date(TEST_NOW.getTime() - 60 * 1000).toISOString(),
      stability: 20,
      difficulty: 5,
      scheduledDays: 20,
      reps: 12,
      lapses: 7,
      lastReview: new Date(TEST_NOW.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    };
    await testEnvironment.studyStorage.recordAnswer(
      {id, state},
      {
        cardId: id,
        rating: "good",
        phaseBefore: "review",
        reviewedAt: state.lastReview,
        scheduledDays: 20,
        due: state.due,
      },
    );

    return openedStudyStore();
  }

  it("is left in the reviews unless the learner chose to set struggling cards aside", async () => {
    const {store} = await storeWithACardOneLapseFromStruggling();
    const id = store.getState().study.session?.currentCardId ?? "";

    store.dispatch(showAnswer());
    await store.dispatch(answerCard("again"));

    expect(store.getState().study.cards[id]).toMatchObject({lapses: 8, suspended: false});
  });

  it("is suspended when the learner chose to set struggling cards aside, and saved so", async () => {
    const {store, storage} = await storeWithACardOneLapseFromStruggling();
    const id = store.getState().study.session?.currentCardId ?? "";
    store.dispatch(setAsideWhenStrugglingChosen(true));

    store.dispatch(showAnswer());
    await store.dispatch(answerCard("again"));

    expect(store.getState().study.cards[id]).toMatchObject({lapses: 8, suspended: true});
    expect((await storage.load()).cards[id]).toMatchObject({suspended: true});
    expect(store.getState().study.session?.currentCardId).not.toBe(id);
  });

  it("is not suspended by an answer that was not a lapse, even when it is still struggling", async () => {
    const {store} = await storeWithACardOneLapseFromStruggling();
    const id = store.getState().study.session?.currentCardId ?? "";
    store.dispatch(setAsideWhenStrugglingChosen(true));
    store.dispatch(strugglingAfterChosen(7));

    store.dispatch(showAnswer());
    await store.dispatch(answerCard("good"));

    expect(store.getState().study.cards[id]?.suspended).toBe(false);
  });
});

it("tells the API the goal was reached, on the study day, when an answer reaches it with the reminder on", async () => {
  const {store, reminders} = await openedStudyStore();
  store.dispatch(dailyGoalChosen(2));
  store.dispatch(reminderEnabledChosen(true));

  store.dispatch(showAnswer());
  await store.dispatch(answerCard("good"));
  expect(reminders.goalMetDays).toEqual([]);

  store.dispatch(showAnswer());
  await store.dispatch(answerCard("good"));
  expect(reminders.goalMetDays).toEqual(["2026-10-05"]);
});

it("does not tell the API about the goal when the reminder is off", async () => {
  const {store, reminders} = await openedStudyStore();
  store.dispatch(dailyGoalChosen(1));

  store.dispatch(showAnswer());
  await store.dispatch(answerCard("good"));

  expect(reminders.goalMetDays).toEqual([]);
});

it("carries on when the API cannot be told the goal was reached", async () => {
  const {store, reminders} = await openedStudyStore();
  vi.spyOn(console, "error").mockImplementation(() => undefined);
  reminders.unreachable = true;
  store.dispatch(dailyGoalChosen(1));
  store.dispatch(reminderEnabledChosen(true));

  store.dispatch(showAnswer());
  await store.dispatch(answerCard("good"));

  expect(store.getState().study.log).toHaveLength(1);
});
