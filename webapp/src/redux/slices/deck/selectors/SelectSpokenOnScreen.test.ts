import {answerCard} from "@src/redux/slices/study/actions/answering/thunks/AnswerCard";
import {openedStudyStore} from "@src/testing/OpenedStudyStore";
import {selectSpokenOnScreen} from "@src/redux/slices/deck/selectors/SelectSpokenOnScreen";
import {sessionEnded} from "@src/redux/slices/study/StudySlice";
import {showAnswer} from "@src/redux/slices/study/actions/answering/thunks/ShowAnswer";

it("is the Korean word on the front of the first card while the answer is hidden", async () => {
  const {store} = await openedStudyStore();

  expect(selectSpokenOnScreen(store.getState())).toEqual({language: "ko", text: "물"});
});

it("is the English answer once it is shown", async () => {
  const {store} = await openedStudyStore();

  store.dispatch(showAnswer());

  expect(selectSpokenOnScreen(store.getState())).toEqual({language: "en", text: "water"});
});

it("is the English first and the Korean answer second on a card that asks in English", async () => {
  const {store} = await openedStudyStore();

  for (let answered = 0; answered < 10; answered += 1) {
    store.dispatch(showAnswer());
    await store.dispatch(answerCard("easy"));
  }
  const front = selectSpokenOnScreen(store.getState());
  store.dispatch(showAnswer());

  expect([front, selectSpokenOnScreen(store.getState())]).toEqual([
    {language: "en", text: "water"},
    {language: "ko", text: "물"},
  ]);
});

it("is nothing when no session is open", async () => {
  const {store} = await openedStudyStore();

  store.dispatch(sessionEnded());

  expect(selectSpokenOnScreen(store.getState())).toBeUndefined();
});
