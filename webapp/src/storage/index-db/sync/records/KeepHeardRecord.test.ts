import {freshIndexedDb} from "@src/testing/environment/browser/FreshIndexedDb";
import type {RecordChange} from "@flashcards/shared/sync/records/RecordChange";

vi.unmock("@src/storage/index-db/sync/records/KeepHeardRecord");
vi.unmock("@src/storage/index-db/sync/records/ReadLocalRecord");

function noteRecord({
  id,
  word = "코끼리",
  at = "2026-01-01T00:00:00.000Z",
}: {
  id: string;
  word?: string;
  at?: string;
}): RecordChange {
  return {kind: "note", id, at, deleted: false, payload: {word, meaning: "elephant", romanisation: "kokkiri"}};
}

beforeEach(() => {
  freshIndexedDb();
});

it("keeps a change heard from another device as the latest known, and not as one to send", async () => {
  const {keepHeardRecord} = await import("@src/storage/index-db/sync/records/KeepHeardRecord");
  const {readLocalRecord} = await import("@src/storage/index-db/sync/records/ReadLocalRecord");
  const {readUnsentRecords} = await import("@src/storage/index-db/sync/records/ReadUnsentRecords");
  const change = noteRecord({id: "ko-custom-1"});

  await keepHeardRecord(change);

  expect(await readLocalRecord("note", "ko-custom-1")).toEqual(change);
  expect(await readUnsentRecords(10)).toEqual([]);
});
