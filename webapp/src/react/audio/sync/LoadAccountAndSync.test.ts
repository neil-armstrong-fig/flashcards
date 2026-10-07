import {loadAccountAndSync} from "@src/react/audio/sync/LoadAccountAndSync";
import {openedStudyStore} from "@src/testing/OpenedStudyStore";

const syncProgress = vi.hoisted(() => vi.fn());

vi.mock("@src/redux/workflows/sync/thunks/SyncProgress", () => ({
  syncProgress: () => async () => {
    syncProgress();
  },
}));

beforeEach(() => {
  syncProgress.mockClear();
});

it("syncs when someone is signed in", async () => {
  const {store, accountApi} = await openedStudyStore();
  accountApi.email = "me@example.com";

  await loadAccountAndSync(store);

  expect(store.getState().account.status).toBe("signedIn");
  expect(syncProgress).toHaveBeenCalledTimes(1);
});

it("syncs nothing when nobody is signed in", async () => {
  const {store} = await openedStudyStore();

  await loadAccountAndSync(store);

  expect(syncProgress).not.toHaveBeenCalled();
});

it("syncs nothing when the API cannot be reached, and the learner carries on", async () => {
  const {store, accountApi} = await openedStudyStore();
  accountApi.unreachable = true;
  vi.spyOn(console, "error").mockImplementation(() => undefined);

  await loadAccountAndSync(store);

  expect(syncProgress).not.toHaveBeenCalled();
  expect(store.getState().account.status).toBe("unreachable");
});
