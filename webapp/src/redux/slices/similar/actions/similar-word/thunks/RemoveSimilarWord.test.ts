import {TEST_NOW} from "@src/testing/time/TestNow";
import {addedSimilarWord} from "@src/testing/AddedSimilarWord";
import {openedStudyStore} from "@src/testing/OpenedStudyStore";
import {removeSimilarWord} from "@src/redux/slices/similar/actions/similar-word/thunks/RemoveSimilarWord";
import {signedIn, signedOut} from "@src/redux/slices/account/AccountSlice";
import type {OpenedStudyStore} from "@src/testing/OpenedStudyStore";

const WATER = "ko-vocab-water";

async function storeWithAWord(): Promise<OpenedStudyStore> {
  const opened = await openedStudyStore();

  opened.store.dispatch(signedIn("me@example.com"));
  await addedSimilarWord(opened.store, WATER, "볼");

  return opened;
}

it("deletes a word the learner added, and records that it was deleted to be sent online", async () => {
  const {store, records} = await storeWithAWord();

  expect(await store.dispatch(removeSimilarWord(WATER, "볼"))).toBe(true);

  expect(store.getState().similar.words[WATER]).toEqual([]);
  expect(records.kept.at(-1)).toEqual({
    kind: "similar",
    id: "ko-vocab-water|볼",
    at: TEST_NOW.toISOString(),
    deleted: true,
  });
});

it("refuses to delete one that ships with the word, and records nothing", async () => {
  const {store, records} = await storeWithAWord();
  const before = records.kept.length;

  expect(await store.dispatch(removeSimilarWord(WATER, "불"))).toBe(false);

  expect(records.kept).toHaveLength(before);
  expect(store.getState().similar.words[WATER]).toEqual(["볼"]);
});

it("deletes a word with nobody signed in, as the change is sent once someone is", async () => {
  const {store} = await storeWithAWord();
  store.dispatch(signedOut());

  expect(await store.dispatch(removeSimilarWord(WATER, "볼"))).toBe(true);
});
