import {addedCustomNote} from "@src/testing/AddedCustomNote";
import {addedSimilarWord} from "@src/testing/AddedSimilarWord";
import {keepRecordingsOfOwnWords} from "@src/react/audio/sync/KeepRecordingsOfOwnWords";
import {openedStudyStore} from "@src/testing/OpenedStudyStore";
import {signedIn} from "@src/redux/slices/account/AccountSlice";
import type {OpenedStudyStore} from "@src/testing/OpenedStudyStore";

const ELEPHANT = {word: "코끼리", meaning: "elephant", romanisation: "kokkiri"};

async function storeWithOwnWords(): Promise<OpenedStudyStore> {
  const opened = await openedStudyStore();

  opened.store.dispatch(signedIn("me@example.com"));
  await addedCustomNote(opened.store, ELEPHANT);
  await addedSimilarWord(opened.store, "ko-vocab-water", "볼");

  return opened;
}

it("fetches the recordings of the cards and similar words this device does not have, as after another device made them", async () => {
  const {store, keptAudio} = await storeWithOwnWords();

  await keepRecordingsOfOwnWords(store);

  expect(keptAudio.kept).toEqual(["코끼리", "elephant", "볼"]);
});

it("fetches nothing for words whose recordings are already here", async () => {
  const {store, keptAudio} = await storeWithOwnWords();

  await keepRecordingsOfOwnWords(store);
  await keepRecordingsOfOwnWords(store);

  expect(keptAudio.kept).toEqual(["코끼리", "elephant", "볼"]);
});

it("skips a word whose recordings cannot be fetched and carries on with the rest", async () => {
  const {store, keptAudio} = await storeWithOwnWords();
  keptAudio.failing = true;
  vi.spyOn(console, "error").mockImplementation(() => undefined);

  await keepRecordingsOfOwnWords(store);
  keptAudio.failing = false;
  await keepRecordingsOfOwnWords(store);

  expect(keptAudio.kept).toEqual(["코끼리", "elephant", "볼"]);
});
