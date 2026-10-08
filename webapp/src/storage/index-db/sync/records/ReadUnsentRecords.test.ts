import {freshIndexedDb} from "@src/testing/environment/browser/FreshIndexedDb";
import type {RecordChange} from "@flashcards/shared/sync/records/RecordChange";

vi.unmock("@src/storage/index-db/sync/records/KeepLocalRecord");

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

it("gives no more than the limit", async () => {
  const {keepLocalRecord} = await import("@src/storage/index-db/sync/records/KeepLocalRecord");
  const {readUnsentRecords} = await import("@src/storage/index-db/sync/records/ReadUnsentRecords");

  await keepLocalRecord(noteRecord({id: "ko-custom-1"}));
  await keepLocalRecord(noteRecord({id: "ko-custom-2"}));
  await keepLocalRecord(noteRecord({id: "ko-custom-3"}));

  expect(await readUnsentRecords(2)).toHaveLength(2);
});
