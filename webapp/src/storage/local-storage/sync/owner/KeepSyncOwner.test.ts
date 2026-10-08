import {keepSyncOwner} from "@src/storage/local-storage/sync/owner/KeepSyncOwner";
import {readSyncOwner} from "@src/storage/local-storage/sync/owner/ReadSyncOwner";

it("keeps whose progress the device holds, under the key devices already use", () => {
  keepSyncOwner("me@example.com");

  expect(localStorage.getItem("flashcards.sync-owner.v1")).toBe('"me@example.com"');
  expect(readSyncOwner()).toBe("me@example.com");
});

it("has no owner until one is kept", () => {
  expect(readSyncOwner()).toBeUndefined();
});
