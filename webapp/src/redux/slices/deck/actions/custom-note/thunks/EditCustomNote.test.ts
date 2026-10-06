import {addedCustomNote} from "@src/testing/AddedCustomNote";
import {editCustomNote} from "@src/redux/slices/deck/actions/custom-note/thunks/EditCustomNote";
import {openedStudyStore} from "@src/testing/OpenedStudyStore";
import {signedIn} from "@src/redux/slices/account/AccountSlice";

const ELEPHANT = {word: "코끼리", meaning: "elephant", romanisation: "kokkiri"};
const WHALE = {word: "고래", meaning: "whale", romanisation: "gorae"};
const ID = "ko-custom-test-1";

async function storeWithAnElephant(): ReturnType<typeof openedStudyStore> {
  const opened = await openedStudyStore();

  opened.store.dispatch(signedIn("me@example.com"));
  await addedCustomNote(opened.store, ELEPHANT);

  return opened;
}

it("changes the words online and here, keeping the id, so both cards keep their progress", async () => {
  const {store, accountApi} = await storeWithAnElephant();
  const before = store.getState().study.cards[`${ID}/to-english`];

  expect(await store.dispatch(editCustomNote(ID, WHALE))).toBe(true);

  expect(accountApi.notes).toEqual([{id: ID, ...WHALE}]);
  expect(store.getState().deck.notes).toEqual([{id: ID, language: "ko", ...WHALE}]);
  expect(store.getState().study.cards[`${ID}/to-english`]).toBe(before);
  expect(store.getState().study.cardOrder.filter(id => id.startsWith(ID))).toHaveLength(2);
});

it("changes nothing, and says so, when the change could not be kept online", async () => {
  const {store, accountApi} = await storeWithAnElephant();
  accountApi.unreachable = true;
  vi.spyOn(console, "error").mockImplementation(() => undefined);

  expect(await store.dispatch(editCustomNote(ID, WHALE))).toBe(false);

  expect(store.getState().deck.notes).toEqual([{id: ID, language: "ko", ...ELEPHANT}]);
  expect(store.getState().deck.editError).toBeDefined();
});
