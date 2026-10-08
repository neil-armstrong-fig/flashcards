import {freshIndexedDb} from "@src/testing/environment/browser/FreshIndexedDb";

vi.unmock("@src/storage/index-db/pictures/StorePicture");
vi.unmock("@src/storage/index-db/pictures/ReadKeptPicture");
vi.unmock("@src/storage/index-db/pictures/ForgetStoredPicture");

beforeEach(() => {
  freshIndexedDb();
});

it("forgets the card's picture and no other", async () => {
  const {storePicture} = await import("@src/storage/index-db/pictures/StorePicture");
  const {readKeptPicture} = await import("@src/storage/index-db/pictures/ReadKeptPicture");
  const {forgetStoredPicture} = await import("@src/storage/index-db/pictures/ForgetStoredPicture");

  await storePicture("c1", new Blob(["one"]), "2026-10-05T10:00:00.000Z");
  await storePicture("c2", new Blob(["two"]), "2026-10-05T10:00:00.000Z");
  await forgetStoredPicture("c1");

  expect(await readKeptPicture("c1")).toBeUndefined();
  expect(await readKeptPicture("c2")).toBeDefined();
});
