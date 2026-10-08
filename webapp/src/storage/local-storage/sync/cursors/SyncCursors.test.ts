import {keepSyncCursors} from "@src/storage/local-storage/sync/cursors/KeepSyncCursors";
import {readSyncCursors} from "@src/storage/local-storage/sync/cursors/ReadSyncCursors";

it("remembers how far the device has read, for the account that read it", () => {
  keepSyncCursors("me@example.com", {events: 12, records: 7});

  expect(readSyncCursors("me@example.com")).toEqual({events: 12, records: 7});
});

it("starts from nothing for another account, and where nothing was kept", () => {
  expect(readSyncCursors("me@example.com")).toEqual({events: 0, records: 0});

  keepSyncCursors("me@example.com", {events: 12, records: 7});

  expect(readSyncCursors("you@example.com")).toEqual({events: 0, records: 0});
});

it("reads a cursor kept before records were counted as no records read", () => {
  localStorage.setItem("flashcards.sync.v1", JSON.stringify({email: "me@example.com", cursor: 5}));

  expect(readSyncCursors("me@example.com")).toEqual({events: 5, records: 0});
});
