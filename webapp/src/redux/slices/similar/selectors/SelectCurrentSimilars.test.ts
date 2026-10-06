import {selectCurrentSimilars} from "@src/redux/slices/similar/selectors/SelectCurrentSimilars";
import {showAnswer} from "@src/redux/slices/study/actions/answering/thunks/ShowAnswer";
import {openedStudyStore} from "@src/testing/OpenedStudyStore";

it("gives the sounds the card on screen is mixed up with, and no shapes for a Korean word", async () => {
  const {store} = await openedStudyStore();
  store.dispatch(showAnswer());

  const similars = selectCurrentSimilars(store.getState());

  expect(similars.shape).toEqual([]);
  expect(similars.sound?.own).toBeDefined();
});

it("is the same object until what it is made of changes, so a component using it does not redraw for nothing", async () => {
  const {store} = await openedStudyStore();

  expect(selectCurrentSimilars(store.getState())).toBe(selectCurrentSimilars(store.getState()));
});
