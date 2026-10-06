import {answerCard} from "@src/redux/slices/study/actions/answering/thunks/AnswerCard";
import {newCardsPerDayChosen} from "@src/redux/slices/settings/SettingsSlice";
import {openedStudyStore} from "@src/testing/OpenedStudyStore";
import {selectCurrentExplanation} from "@src/redux/slices/deck/selectors/SelectCurrentExplanation";
import {showAnswer} from "@src/redux/slices/study/actions/answering/thunks/ShowAnswer";
import {startSession} from "@src/redux/slices/study/actions/session/thunks/StartSession";
import type {AppStore} from "@src/redux/Store";

/** Studies a deck, answering cards easily until the one asked for is on screen. */
async function storeShowing(cardId: string, deckId = "ja-katakana"): Promise<AppStore> {
  const {store} = await openedStudyStore();

  store.dispatch(newCardsPerDayChosen({deckId, count: 999}));
  store.dispatch(startSession(deckId));

  while (store.getState().study.session?.currentCardId !== cardId) {
    expect(store.getState().study.session?.currentCardId).toBeDefined();
    store.dispatch(showAnswer());
    await store.dispatch(answerCard("easy"));
  }

  return store;
}

it("gives nothing when no session is open", async () => {
  const {store} = await openedStudyStore();

  expect(selectCurrentExplanation({...store.getState(), study: {...store.getState().study, session: undefined}})).toBe(
    "",
  );
});

it("gives why a katakana for foreign sounds exists, from either of its cards", async () => {
  const asking = await storeShowing("ja-katakana-fa/to-english", "ja-katakana-foreign");
  const answering = await storeShowing("ja-katakana-fa/from-english", "ja-katakana-foreign");

  expect(selectCurrentExplanation(asking.getState())).toContain("foreign words");
  expect(selectCurrentExplanation(answering.getState())).toBe(selectCurrentExplanation(asking.getState()));
});

it("gives nothing for a basic kana", async () => {
  const store = await storeShowing("ja-katakana-a/to-english");

  expect(selectCurrentExplanation(store.getState())).toBe("");
});
