import {TEST_NOW} from "@src/testing/time/TestNow";
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

it("changes the words, keeping the id, so both cards keep their progress, and records the change to be sent online", async () => {
  const {store, records} = await storeWithAnElephant();
  const before = store.getState().study.cards[`${ID}/to-english`];

  expect(await store.dispatch(editCustomNote(ID, WHALE))).toBe(true);

  expect(records.kept.at(-1)).toEqual({
    kind: "note",
    id: ID,
    at: TEST_NOW.toISOString(),
    deleted: false,
    payload: WHALE,
  });
  expect(store.getState().deck.notes).toEqual([{id: ID, language: "ko", ...WHALE}]);
  expect(store.getState().study.cards[`${ID}/to-english`]).toBe(before);
  expect(store.getState().study.cardOrder.filter(id => id.startsWith(ID))).toHaveLength(2);
});
