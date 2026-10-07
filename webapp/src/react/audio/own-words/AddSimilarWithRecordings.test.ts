import {addSimilarWithRecordings} from "@src/react/audio/own-words/AddSimilarWithRecordings";
import {openedStudyStore} from "@src/testing/OpenedStudyStore";
import {selectSimilar} from "@src/redux/slices/similar/selectors/SelectSimilar";
import {signedIn} from "@src/redux/slices/account/AccountSlice";
import type {OpenedStudyStore} from "@src/testing/OpenedStudyStore";

async function signedInStore(): Promise<OpenedStudyStore> {
  const opened = await openedStudyStore();

  opened.store.dispatch(signedIn("me@example.com"));

  return opened;
}

it("shows the similars that ship with the first card's word", async () => {
  const {store} = await signedInStore();

  expect(selectSimilar(store.getState())).toEqual({
    noteId: "ko-vocab-water",
    own: "물",
    words: ["불"],
    shipped: ["불"],
    learned: [],
  });
});

it("asks for the word, keeps it with the card, and offers it after the shipped ones", async () => {
  const {store, keptAudio} = await signedInStore();

  await addSimilarWithRecordings(store.dispatch, "ko-vocab-water", "볼");

  expect(keptAudio.kept).toEqual(["볼"]);
  expect(selectSimilar(store.getState())?.words).toEqual(["불", "볼"]);
  expect(store.getState().similar).toMatchObject({adding: false, error: undefined});
});

it.each([
  ["something that is not Korean", "water"],
  ["nothing", "  "],
  ["the card's own word", "물"],
  ["a similar already there", "불"],
])("refuses %s, with a reason, without asking for anything", async (_name, text) => {
  const {store, keptAudio} = await signedInStore();

  await addSimilarWithRecordings(store.dispatch, "ko-vocab-water", text);

  expect(keptAudio.kept).toEqual([]);
  expect(store.getState().similar.error).toBeDefined();
});

it("keeps nothing, and says so, when the recordings could not be fetched", async () => {
  const {store, keptAudio} = await signedInStore();
  keptAudio.failing = true;
  vi.spyOn(console, "error").mockImplementation(() => undefined);

  await addSimilarWithRecordings(store.dispatch, "ko-vocab-water", "볼");

  expect(selectSimilar(store.getState())?.words).toEqual(["불"]);
  expect(store.getState().similar).toMatchObject({adding: false, error: expect.stringContaining("Could not get")});
});

it("is the same word's similars on its other card", async () => {
  const {store} = await signedInStore();

  await addSimilarWithRecordings(store.dispatch, "ko-vocab-water", "볼");

  expect(selectSimilar(store.getState())?.noteId).toBe("ko-vocab-water");
});

it("says whether the word was added", async () => {
  const {store} = await signedInStore();

  expect(await addSimilarWithRecordings(store.dispatch, "ko-vocab-water", "볼")).toBe(true);
  expect(await addSimilarWithRecordings(store.dispatch, "ko-vocab-water", "water")).toBe(false);
});

it("records the word, with the note it was asked on, to be sent online", async () => {
  const {store, records} = await signedInStore();

  await addSimilarWithRecordings(store.dispatch, "ko-vocab-water", "볼");

  expect(records.summary()).toEqual(["similar ko-vocab-water|볼 kept"]);
});

it("adds the word even when the API cannot be reached, as it is sent when it can be", async () => {
  const {store, accountApi} = await signedInStore();
  accountApi.unreachable = true;

  expect(await addSimilarWithRecordings(store.dispatch, "ko-vocab-water", "볼")).toBe(true);
  expect(selectSimilar(store.getState())?.words).toEqual(["불", "볼"]);
});

it("does nothing when nobody is signed in, since only a signed-in learner can spend the allowance", async () => {
  const {store, keptAudio} = await openedStudyStore();

  expect(await addSimilarWithRecordings(store.dispatch, "ko-vocab-water", "볼")).toBe(false);
  expect(keptAudio.kept).toEqual([]);
});

it("keeps a word with the note it was asked on, not with whatever card is on screen", async () => {
  const {store} = await signedInStore();

  await addSimilarWithRecordings(store.dispatch, "ko-vocab-rice", "방");

  expect(store.getState().similar.words).toEqual({"ko-vocab-rice": ["방"]});
});
