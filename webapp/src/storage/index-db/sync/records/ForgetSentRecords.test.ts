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

it("takes a sent change off the list to send", async () => {
  const {keepLocalRecord} = await import("@src/storage/index-db/sync/records/KeepLocalRecord");
  const {forgetSentRecords} = await import("@src/storage/index-db/sync/records/ForgetSentRecords");
  const {readUnsentRecords} = await import("@src/storage/index-db/sync/records/ReadUnsentRecords");
  const change = noteRecord({id: "ko-custom-1"});

  await keepLocalRecord(change);
  await forgetSentRecords([change]);

  expect(await readUnsentRecords(10)).toEqual([]);
});

it("keeps a change made again while the sync was under way, to send next time", async () => {
  const {keepLocalRecord} = await import("@src/storage/index-db/sync/records/KeepLocalRecord");
  const {forgetSentRecords} = await import("@src/storage/index-db/sync/records/ForgetSentRecords");
  const {readUnsentRecords} = await import("@src/storage/index-db/sync/records/ReadUnsentRecords");
  const sent = noteRecord({id: "ko-custom-1", at: "2026-01-01T00:00:00.000Z"});
  const later = noteRecord({id: "ko-custom-1", word: "코", at: "2026-01-01T00:00:05.000Z"});

  await keepLocalRecord(sent);
  await keepLocalRecord(later);
  await forgetSentRecords([sent]);

  expect(await readUnsentRecords(10)).toEqual([later]);
});
