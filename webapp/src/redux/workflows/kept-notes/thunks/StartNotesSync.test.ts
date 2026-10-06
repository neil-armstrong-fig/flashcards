import {openedStudyStore} from "@src/testing/OpenedStudyStore";
import {signedIn} from "@src/redux/slices/account/AccountSlice";
import {noteAdded} from "@src/redux/slices/deck/DeckSlice";
import {startNotesSync} from "@src/redux/workflows/kept-notes/thunks/StartNotesSync";
import type {KeptNote} from "@src/redux/slices/account/types/KeptNote";

const ELEPHANT: KeptNote = {id: "ko-custom-a", word: "코끼리", meaning: "elephant", romanisation: "kokkiri"};
const GIRAFFE: KeptNote = {id: "ko-custom-b", word: "기린", meaning: "giraffe", romanisation: "girin"};

it("gives back the cards kept online, adding none of them yet", async () => {
  const {store, accountApi} = await openedStudyStore();
  store.dispatch(signedIn("me@example.com"));
  accountApi.notes = [ELEPHANT, GIRAFFE];

  expect(await store.dispatch(startNotesSync())).toEqual([ELEPHANT, GIRAFFE]);
  expect(store.getState().deck.notes).toEqual([]);
});

it("drops a card here that the API no longer has, because the API is the truth", async () => {
  const {store, accountApi} = await openedStudyStore();
  store.dispatch(signedIn("me@example.com"));
  store.dispatch(noteAdded({...ELEPHANT, language: "ko"}));
  accountApi.notes = [GIRAFFE];

  await store.dispatch(startNotesSync());

  expect(store.getState().deck.notes).toEqual([]);
});

it("gives back nothing, and changes nothing, when the API cannot be reached", async () => {
  const {store, accountApi} = await openedStudyStore();
  store.dispatch(signedIn("me@example.com"));
  store.dispatch(noteAdded({...ELEPHANT, language: "ko"}));
  accountApi.unreachable = true;
  vi.spyOn(console, "error").mockImplementation(() => undefined);

  expect(await store.dispatch(startNotesSync())).toBeUndefined();
  expect(store.getState().deck.notes).toHaveLength(1);
});
