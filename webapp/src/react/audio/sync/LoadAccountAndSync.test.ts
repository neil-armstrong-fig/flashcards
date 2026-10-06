import {loadAccountAndSync} from "@src/react/audio/sync/LoadAccountAndSync";
import {openedStudyStore} from "@src/testing/OpenedStudyStore";
import {selectSimilar} from "@src/redux/slices/similar/selectors/SelectSimilar";

it("brings down the words kept online when someone is signed in, with their recordings", async () => {
  const {store, accountApi, keptAudio} = await openedStudyStore();
  accountApi.email = "me@example.com";
  accountApi.kept = {"ko-vocab-water": ["볼"]};

  await loadAccountAndSync(store);

  expect(selectSimilar(store.getState())?.words).toEqual(["불", "볼"]);
  expect(keptAudio.kept).toEqual(["볼"]);
});

it("brings down nothing when nobody is signed in", async () => {
  const {store, accountApi, keptAudio} = await openedStudyStore();
  accountApi.kept = {"ko-vocab-water": ["볼"]};

  await loadAccountAndSync(store);

  expect(selectSimilar(store.getState())?.words).toEqual(["불"]);
  expect(keptAudio.kept).toEqual([]);
});

it("skips a word whose recordings cannot be fetched, and carries on with the rest", async () => {
  const {store, accountApi, keptAudio} = await openedStudyStore();
  accountApi.email = "me@example.com";
  accountApi.kept = {"ko-vocab-water": ["볼"]};
  keptAudio.failing = true;
  vi.spyOn(console, "error").mockImplementation(() => undefined);

  await loadAccountAndSync(store);

  expect(selectSimilar(store.getState())?.words).toEqual(["불"]);
  expect(store.getState().account.status).toBe("signedIn");
});
