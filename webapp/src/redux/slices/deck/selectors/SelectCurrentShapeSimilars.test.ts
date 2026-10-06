import {answerCard} from "@src/redux/slices/study/actions/answering/thunks/AnswerCard";
import {newCardsPerDayChosen} from "@src/redux/slices/settings/SettingsSlice";
import {openedStudyStore} from "@src/testing/OpenedStudyStore";
import {selectCurrentShapeSimilars} from "@src/redux/slices/deck/selectors/SelectCurrentShapeSimilars";
import {showAnswer} from "@src/redux/slices/study/actions/answering/thunks/ShowAnswer";
import {startSession} from "@src/redux/slices/study/actions/session/thunks/StartSession";
import type {AppStore} from "@src/redux/Store";

/** Studies a katakana deck, answering cards easily until the one asked for is on screen. */
async function storeShowing(cardId: string): Promise<AppStore> {
  const {store} = await openedStudyStore();

  store.dispatch(newCardsPerDayChosen({deckId: "ja-katakana", count: 999}));
  store.dispatch(startSession("ja-katakana"));

  while (store.getState().study.session?.currentCardId !== cardId) {
    expect(store.getState().study.session?.currentCardId).toBeDefined();
    store.dispatch(showAnswer());
    await store.dispatch(answerCard("easy"));
  }

  return store;
}

it("gives nothing when no session is open", async () => {
  const {store} = await openedStudyStore();

  expect(
    selectCurrentShapeSimilars({...store.getState(), study: {...store.getState().study, session: undefined}}),
  ).toEqual([]);
});

it("gives the characters a katakana is taken for, from the card that asks for its sound", async () => {
  const store = await storeShowing("ja-katakana-shi/to-english");

  expect(selectCurrentShapeSimilars(store.getState())).toEqual([{character: "ツ", sound: "tsu"}]);
});

it("gives the same from the card that asks for the character, because both cards of a note share them", async () => {
  const store = await storeShowing("ja-katakana-shi/from-english");

  expect(selectCurrentShapeSimilars(store.getState())).toEqual([{character: "ツ", sound: "tsu"}]);
});

it("gives nothing for a katakana that is not commonly confused", async () => {
  const store = await storeShowing("ja-katakana-a/to-english");

  expect(selectCurrentShapeSimilars(store.getState())).toEqual([]);
});
