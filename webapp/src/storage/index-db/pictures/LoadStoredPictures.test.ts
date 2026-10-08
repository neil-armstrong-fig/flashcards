import {freshIndexedDb} from "@src/testing/environment/browser/FreshIndexedDb";

vi.unmock("@src/storage/index-db/pictures/StorePicture");
vi.unmock("@src/storage/index-db/pictures/LoadStoredPictures");

beforeEach(() => {
  freshIndexedDb();
});

it("is empty where no picture is kept", async () => {
  const {loadStoredPictures} = await import("@src/storage/index-db/pictures/LoadStoredPictures");

  expect(await loadStoredPictures()).toEqual({});
});

it("gives every kept picture by card, with an address to show it by and when it was added", async () => {
  const {storePicture} = await import("@src/storage/index-db/pictures/StorePicture");
  const {loadStoredPictures} = await import("@src/storage/index-db/pictures/LoadStoredPictures");

  await storePicture("c1", new Blob(["one"]), "2026-10-05T10:00:00.000Z");
  await storePicture("c2", new Blob(["two"]), "2026-10-06T10:00:00.000Z");
  const pictures = await loadStoredPictures();

  expect(Object.keys(pictures).sort()).toEqual(["c1", "c2"]);
  expect(pictures["c2"]?.addedAt).toBe("2026-10-06T10:00:00.000Z");
  expect(pictures["c1"]?.address).toMatch(/^blob:/);
});
