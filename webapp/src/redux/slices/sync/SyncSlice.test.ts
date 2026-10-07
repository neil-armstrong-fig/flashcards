import {syncFailed, syncFinished, syncReducer, syncStarted} from "@src/redux/slices/sync/SyncSlice";

it("has not synced until a sync has finished, and says so while one is under way", () => {
  const start = syncReducer(undefined, {type: "init"});

  expect(start.status).toBe("not-synced");
  expect(syncReducer(start, syncStarted()).status).toBe("syncing");
  expect(syncReducer(syncReducer(start, syncStarted()), syncFinished()).status).toBe("synced");
});

it("goes back to not synced when a sync fails", () => {
  expect(syncReducer(syncReducer(undefined, syncStarted()), syncFailed()).status).toBe("not-synced");
});
