import {loadAccountAndSync} from "@src/react/audio/sync/LoadAccountAndSync";
import {openedStudyStore} from "@src/testing/OpenedStudyStore";
import {selectSimilar} from "@src/redux/slices/similar/selectors/SelectSimilar";
import {syncKeptSimilar} from "@src/react/audio/sync/SyncKeptSimilar";

it("fetches the recordings again for a word it has but whose recordings are gone", async () => {
  const {store, accountApi, keptAudio} = await openedStudyStore();
  accountApi.email = "me@example.com";
  accountApi.kept = {"ko-vocab-water": ["볼"]};
  await loadAccountAndSync(store);
  keptAudio.kept.length = 0;

  await syncKeptSimilar(store);

  expect(keptAudio.kept).toEqual(["볼"]);
  expect(selectSimilar(store.getState())?.words).toEqual(["불", "볼"]);
});
