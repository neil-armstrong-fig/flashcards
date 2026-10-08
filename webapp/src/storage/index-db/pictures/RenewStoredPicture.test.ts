import {freshIndexedDb} from "@src/testing/environment/browser/FreshIndexedDb";

vi.unmock("@src/storage/index-db/pictures/StorePicture");
vi.unmock("@src/storage/index-db/pictures/ReadKeptPicture");
vi.unmock("@src/storage/index-db/pictures/RenewStoredPicture");

beforeEach(() => {
  freshIndexedDb();
});

it("dates a kept picture afresh, and gives the picture", async () => {
  const {storePicture} = await import("@src/storage/index-db/pictures/StorePicture");
  const {readKeptPicture} = await import("@src/storage/index-db/pictures/ReadKeptPicture");
  const {renewStoredPicture} = await import("@src/storage/index-db/pictures/RenewStoredPicture");

  await storePicture("c1", new Blob(["one"]), "2026-10-05T10:00:00.000Z");
  const renewed = await renewStoredPicture("c1", "2026-11-01T10:00:00.000Z");

  expect(await renewed?.text()).toBe("one");
  expect((await readKeptPicture("c1"))?.addedAt).toBe("2026-11-01T10:00:00.000Z");
});

it("gives nothing, and keeps nothing, for a card with no picture", async () => {
  const {readKeptPicture} = await import("@src/storage/index-db/pictures/ReadKeptPicture");
  const {renewStoredPicture} = await import("@src/storage/index-db/pictures/RenewStoredPicture");

  expect(await renewStoredPicture("c1", "2026-11-01T10:00:00.000Z")).toBeUndefined();
  expect(await readKeptPicture("c1")).toBeUndefined();
});
