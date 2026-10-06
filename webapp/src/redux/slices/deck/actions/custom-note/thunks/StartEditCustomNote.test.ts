import {addedCustomNote} from "@src/testing/AddedCustomNote";
import {openedStudyStore} from "@src/testing/OpenedStudyStore";
import {signedIn, signedOut} from "@src/redux/slices/account/AccountSlice";
import {startEditCustomNote} from "@src/redux/slices/deck/actions/custom-note/thunks/StartEditCustomNote";

const ELEPHANT = {word: "코끼리", meaning: "elephant", romanisation: "kokkiri"};
const WHALE = {word: "고래", meaning: "whale", romanisation: "gorae"};
const ID = "ko-custom-test-1";

async function storeWithAnElephant(): ReturnType<typeof openedStudyStore> {
  const opened = await openedStudyStore();

  opened.store.dispatch(signedIn("me@example.com"));
  await addedCustomNote(opened.store, ELEPHANT);

  return opened;
}

it("gives back the words as checked and the card as it was, and marks the card as being changed", async () => {
  const {store} = await storeWithAnElephant();

  const started = store.dispatch(startEditCustomNote(ID, WHALE));

  expect(started).toEqual({words: WHALE, previous: {id: ID, language: "ko", ...ELEPHANT}});
  expect(store.getState().deck.adding).toBe(true);
});

it("allows a card to keep its own word", async () => {
  const {store} = await storeWithAnElephant();

  expect(store.dispatch(startEditCustomNote(ID, {...ELEPHANT, meaning: "tusker"}))?.words.meaning).toBe("tusker");
});

it("needs a card of the learner's own", async () => {
  const {store} = await storeWithAnElephant();

  expect(store.dispatch(startEditCustomNote("ko-vocab-water", WHALE))).toBeUndefined();
  expect(store.dispatch(startEditCustomNote("ko-custom-nothing", WHALE))).toBeUndefined();
  expect(store.getState().deck.adding).toBe(false);
});

it("needs someone signed in", async () => {
  const {store} = await storeWithAnElephant();
  store.dispatch(signedOut());

  expect(store.dispatch(startEditCustomNote(ID, WHALE))).toBeUndefined();
});

it("refuses the word of another card, with a reason, and marks nothing as being changed", async () => {
  const {store} = await storeWithAnElephant();

  expect(store.dispatch(startEditCustomNote(ID, {...WHALE, word: "물"}))).toBeUndefined();
  expect(store.getState().deck.editError).toBe("That word is already here.");
  expect(store.getState().deck.adding).toBe(false);
});
