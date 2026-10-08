import {freshIndexedDb} from "@src/testing/environment/browser/FreshIndexedDb";

vi.unmock("@src/storage/index-db/pictures/StorePicture");
vi.unmock("@src/storage/index-db/pictures/ReadKeptPicture");

beforeEach(() => {
  freshIndexedDb();
});

it("keeps a picture for a card, and gives an address to show it by", async () => {
  const {storePicture} = await import("@src/storage/index-db/pictures/StorePicture");
  const {readKeptPicture} = await import("@src/storage/index-db/pictures/ReadKeptPicture");

  const address = await storePicture("c1", new Blob(["pic"], {type: "image/png"}), "2026-10-05T10:00:00.000Z");
  const kept = await readKeptPicture("c1");

  expect(address).toMatch(/^blob:/);
  expect(kept?.addedAt).toBe("2026-10-05T10:00:00.000Z");
  expect(await kept?.picture.text()).toBe("pic");
});

it("replaces the picture a card had", async () => {
  const {storePicture} = await import("@src/storage/index-db/pictures/StorePicture");
  const {readKeptPicture} = await import("@src/storage/index-db/pictures/ReadKeptPicture");

  await storePicture("c1", new Blob(["old"]), "2026-10-05T10:00:00.000Z");
  await storePicture("c1", new Blob(["new"]), "2026-10-06T10:00:00.000Z");

  expect(await (await readKeptPicture("c1"))?.picture.text()).toBe("new");
});
