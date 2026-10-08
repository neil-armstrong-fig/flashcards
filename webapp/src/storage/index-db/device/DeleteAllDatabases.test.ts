import {freshIndexedDb} from "@src/testing/environment/browser/FreshIndexedDb";
import {openDB} from "idb";

beforeEach(() => {
  freshIndexedDb();
});

async function databaseNames(): Promise<(string | undefined)[]> {
  return (await indexedDB.databases()).map(database => database.name);
}

it("deletes every database the origin holds, whoever made it", async () => {
  (await openDB("flashcards", 1)).close();
  (await openDB("flashcards-pictures", 1)).close();

  const {deleteAllDatabases} = await import("@src/storage/index-db/device/DeleteAllDatabases");

  await deleteAllDatabases();

  expect(await databaseNames()).toEqual([]);
});

it("deletes the databases the app has open, which let go when asked", async () => {
  const {openStudyDatabase} = await import("@src/storage/index-db/study/database/OpenStudyDatabase");
  const {openPictureDatabase} = await import("@src/storage/index-db/pictures/database/OpenPictureDatabase");
  const {deleteAllDatabases} = await import("@src/storage/index-db/device/DeleteAllDatabases");

  await openStudyDatabase();
  await openPictureDatabase();
  await deleteAllDatabases();

  expect(await databaseNames()).toEqual([]);
});

it("gives up on a database that stays open, which the browser finishes deleting once it closes, so the page can still reload", async () => {
  vi.useFakeTimers({toFake: ["setTimeout"]});
  const held = await openDB("held-open", 1);
  const {deleteAllDatabases} = await import("@src/storage/index-db/device/DeleteAllDatabases");

  const finished = deleteAllDatabases();

  await vi.advanceTimersByTimeAsync(2_000);
  await finished;
  held.close();

  await vi.waitFor(async () => {
    expect(await databaseNames()).toEqual([]);
  });
});
