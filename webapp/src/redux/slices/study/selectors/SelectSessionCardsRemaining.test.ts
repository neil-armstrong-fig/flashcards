import {answerCard} from "@src/redux/slices/study/actions/answering/thunks/AnswerCard";
import {showAnswer} from "@src/redux/slices/study/actions/answering/thunks/ShowAnswer";
import {openedStudyStore} from "@src/testing/OpenedStudyStore";
import {selectSessionCardsRemaining} from "@src/redux/slices/study/selectors/SelectSessionCardsRemaining";
import {startSession} from "@src/redux/slices/study/actions/session/thunks/StartSession";
import {markCardHard} from "@src/redux/slices/study/actions/setting-aside/thunks/MarkCardHard";
import {sessionEnded} from "@src/redux/slices/study/StudySlice";

it("counts the whole deck's day for a session on the whole deck", async () => {
  const {store} = await openedStudyStore();

  expect(selectSessionCardsRemaining(store.getState())).toBe(20);
});

it("counts only the new cards for a session on those, leaving out one being learned", async () => {
  const {store} = await openedStudyStore();
  store.dispatch(showAnswer());
  await store.dispatch(answerCard("again"));

  store.dispatch(startSession("ko-starter", "new"));

  expect(selectSessionCardsRemaining(store.getState())).toBe(19);
});

it("counts only the struggling cards for a session on those", async () => {
  const {store} = await openedStudyStore();
  await store.dispatch(markCardHard());

  store.dispatch(startSession("ko-starter", "struggling"));

  expect(selectSessionCardsRemaining(store.getState())).toBe(1);
});

it("is zero when no session is open", async () => {
  const {store} = await openedStudyStore();
  store.dispatch(sessionEnded());

  expect(selectSessionCardsRemaining(store.getState())).toBe(0);
});
