import {freshIndexedDb} from "@src/testing/environment/browser/FreshIndexedDb";

vi.unmock("@src/storage/index-db/sync/records/ReadLocalRecord");

beforeEach(() => {
  freshIndexedDb();
});

it("gives nothing for a thing it has heard of no change to", async () => {
  const {readLocalRecord} = await import("@src/storage/index-db/sync/records/ReadLocalRecord");

  expect(await readLocalRecord("note", "ko-custom-1")).toBeUndefined();
});
