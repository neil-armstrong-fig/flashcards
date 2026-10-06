import {openedStudyStore} from "@src/testing/OpenedStudyStore";
import {signedIn} from "@src/redux/slices/account/AccountSlice";
import {startCustomNote} from "@src/redux/slices/deck/actions/custom-note/thunks/StartCustomNote";

const ELEPHANT = {word: "코끼리", meaning: "elephant", romanisation: "kokkiri"};

it("gives back the words as checked, and marks the card as being made", async () => {
  const {store} = await openedStudyStore();
  store.dispatch(signedIn("me@example.com"));

  const checked = store.dispatch(startCustomNote({word: " 코끼리 ", meaning: " elephant ", romanisation: " kokkiri "}));

  expect(checked).toEqual(ELEPHANT);
  expect(store.getState().deck.adding).toBe(true);
});

it("needs someone signed in", async () => {
  const {store} = await openedStudyStore();

  expect(store.dispatch(startCustomNote(ELEPHANT))).toBeUndefined();
  expect(store.getState().deck.adding).toBe(false);
});

it("does not start a second card while one is being made", async () => {
  const {store} = await openedStudyStore();
  store.dispatch(signedIn("me@example.com"));
  store.dispatch(startCustomNote(ELEPHANT));

  expect(store.dispatch(startCustomNote({...ELEPHANT, word: "고래"}))).toBeUndefined();
});

it.each([
  ["a word that is not Korean", {...ELEPHANT, word: "elephant"}],
  ["no meaning", {...ELEPHANT, meaning: ""}],
  ["a word the deck already has", {...ELEPHANT, word: "물"}],
])("refuses %s with a reason, and marks nothing as being made", async (_name, words) => {
  const {store} = await openedStudyStore();
  store.dispatch(signedIn("me@example.com"));

  expect(store.dispatch(startCustomNote(words))).toBeUndefined();
  expect(store.getState().deck.error).toBeDefined();
  expect(store.getState().deck.adding).toBe(false);
});
