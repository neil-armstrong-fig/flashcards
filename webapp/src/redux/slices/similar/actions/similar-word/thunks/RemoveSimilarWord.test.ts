import {addedSimilarWord} from "@src/testing/AddedSimilarWord";
import {openedStudyStore} from "@src/testing/OpenedStudyStore";
import {removeSimilarWord} from "@src/redux/slices/similar/actions/similar-word/thunks/RemoveSimilarWord";
import {signedIn} from "@src/redux/slices/account/AccountSlice";
import type {OpenedStudyStore} from "@src/testing/OpenedStudyStore";

const WATER = "ko-vocab-water";

async function storeWithAWord(): Promise<OpenedStudyStore> {
  const opened = await openedStudyStore();

  opened.store.dispatch(signedIn("me@example.com"));
  await addedSimilarWord(opened.store, WATER, "볼");

  return opened;
}

it("deletes a word the learner added, online and here", async () => {
  const {store, accountApi} = await storeWithAWord();

  expect(await store.dispatch(removeSimilarWord(WATER, "볼"))).toBe(true);

  expect(store.getState().similar.words[WATER]).toEqual([]);
  expect(accountApi.kept[WATER]).toEqual([]);
});

it("refuses to delete one that ships with the word", async () => {
  const {store, accountApi} = await storeWithAWord();

  expect(await store.dispatch(removeSimilarWord(WATER, "불"))).toBe(false);

  expect(accountApi.kept[WATER]).toEqual(["볼"]);
});

it("keeps the word, and says so, when it could not be deleted online", async () => {
  const {store, accountApi} = await storeWithAWord();
  accountApi.unreachable = true;
  vi.spyOn(console, "error").mockImplementation(() => undefined);

  expect(await store.dispatch(removeSimilarWord(WATER, "볼"))).toBe(false);

  expect(store.getState().similar.words[WATER]).toEqual(["볼"]);
  expect(store.getState().similar.error).toBeDefined();
});

it("does nothing when nobody is signed in", async () => {
  const {store} = await openedStudyStore();

  expect(await store.dispatch(removeSimilarWord(WATER, "볼"))).toBe(false);
});
