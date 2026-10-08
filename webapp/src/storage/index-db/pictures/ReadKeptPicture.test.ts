import {freshIndexedDb} from "@src/testing/environment/browser/FreshIndexedDb";

vi.unmock("@src/storage/index-db/pictures/ReadKeptPicture");

beforeEach(() => {
  freshIndexedDb();
});

it("gives nothing for a card with no picture", async () => {
  const {readKeptPicture} = await import("@src/storage/index-db/pictures/ReadKeptPicture");

  expect(await readKeptPicture("c1")).toBeUndefined();
});
