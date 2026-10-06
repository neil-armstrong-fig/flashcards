import {openedStudyStore} from "@src/testing/OpenedStudyStore";
import {signedIn} from "@src/redux/slices/account/AccountSlice";
import {startSimilarWord} from "@src/redux/slices/similar/actions/similar-word/thunks/StartSimilarWord";

it("gives back the word as checked, and marks it as being added", async () => {
  const {store} = await openedStudyStore();
  store.dispatch(signedIn("me@example.com"));

  expect(store.dispatch(startSimilarWord("ko-vocab-water", " 볼 "))).toBe("볼");
  expect(store.getState().similar.adding).toBe(true);
});

it("needs someone signed in", async () => {
  const {store} = await openedStudyStore();

  expect(store.dispatch(startSimilarWord("ko-vocab-water", "볼"))).toBeUndefined();
  expect(store.getState().similar.adding).toBe(false);
});

it.each([
  ["something that is not Korean", "water"],
  ["nothing", "  "],
  ["the card's own word", "물"],
  ["a similar already there", "불"],
])("refuses %s, with a reason, and marks nothing as being added", async (_name, text) => {
  const {store} = await openedStudyStore();
  store.dispatch(signedIn("me@example.com"));

  expect(store.dispatch(startSimilarWord("ko-vocab-water", text))).toBeUndefined();
  expect(store.getState().similar.error).toBeDefined();
  expect(store.getState().similar.adding).toBe(false);
});
