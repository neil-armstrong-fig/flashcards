import {TEST_NOW} from "@src/testing/time/TestNow";
import {addSimilarWord} from "@src/redux/slices/similar/actions/similar-word/thunks/AddSimilarWord";
import {openedStudyStore} from "@src/testing/OpenedStudyStore";
import {selectSimilar} from "@src/redux/slices/similar/selectors/SelectSimilar";

it("offers the word after the shipped ones, and records it with the note it was asked on to be sent online", async () => {
  const {store, records} = await openedStudyStore();

  expect(await store.dispatch(addSimilarWord("ko-vocab-water", "볼"))).toBe(true);

  expect(records.kept).toEqual([
    {
      kind: "similar",
      id: "ko-vocab-water|볼",
      at: TEST_NOW.toISOString(),
      deleted: false,
      payload: {noteId: "ko-vocab-water", text: "볼"},
    },
  ]);
  expect(selectSimilar(store.getState())?.words).toEqual(["불", "볼"]);
  expect(store.getState().similar).toMatchObject({adding: false, error: undefined});
});
