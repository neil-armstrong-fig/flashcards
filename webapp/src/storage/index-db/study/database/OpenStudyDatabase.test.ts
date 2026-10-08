import {freshIndexedDb} from "@src/testing/environment/browser/FreshIndexedDb";
import {newCardState} from "@src/spaced-repetition/card/NewCardState";
import {openDB} from "idb";
import type {IDBPDatabase} from "idb";
import type {StudyDatabase} from "@src/storage/index-db/study/database/types/StudyDatabase";

vi.unmock("@src/storage/index-db/study/LoadStoredStudy");
vi.unmock("@src/storage/index-db/study/RecordAnswer");
vi.unmock("@src/storage/index-db/study/SaveCard");

const EVENT_KEY = ["cardId", "at", "kind"];
const RECORD_KEY = ["kind", "id"];
const ANSWER = {cardId: "ko-water-forward", kind: "suspend", at: "2026-01-01T10:00:00.000Z"};

beforeEach(() => {
  freshIndexedDb();
});

async function openStudyDatabase(): Promise<IDBPDatabase<StudyDatabase>> {
  const module = await import("@src/storage/index-db/study/database/OpenStudyDatabase");

  return await module.openStudyDatabase();
}

/** A database as an earlier release left it: the stores it had then, and nothing else. */
async function databaseAtVersion(version: 1 | 2 | 3, fill: (database: IDBPDatabase) => Promise<void>): Promise<void> {
  const database = await openDB("flashcards", version, {
    upgrade(upgrading) {
      upgrading.createObjectStore("cards", {keyPath: "id"});
      upgrading.createObjectStore("log", {keyPath: ["cardId", "reviewedAt"]});

      if (version >= 2) {
        upgrading.createObjectStore("events", {keyPath: EVENT_KEY});
      }

      if (version === 3) {
        upgrading.createObjectStore("unsent", {keyPath: EVENT_KEY});
      }
    },
  });

  await fill(database);
  database.close();
}

it("makes every store in a database that is new", async () => {
  const database = await openStudyDatabase();

  expect([...database.objectStoreNames].sort()).toEqual(
    ["cards", "events", "log", "records", "unsent", "unsent-records"].sort(),
  );
});

it("keeps what a version 1 database held, and makes the events its cards and answers imply, all still to be sent", async () => {
  await databaseAtVersion(1, async database => {
    await database.put("cards", {
      id: "ko-water-forward",
      state: newCardState({
        phase: "review",
        reps: 1,
        stability: 3,
        difficulty: 5,
        scheduledDays: 3,
        due: "2026-01-04T10:00:00.000Z",
      }),
    });
    await database.put("log", {
      cardId: "ko-water-forward",
      rating: "good",
      phaseBefore: "new",
      reviewedAt: "2026-01-01T10:00:00.000Z",
      scheduledDays: 3,
      due: "2026-01-04T10:00:00.000Z",
    });
  });

  const database = await openStudyDatabase();
  const events = await database.getAll("events");

  expect(await database.count("cards")).toBe(1);
  expect(await database.count("log")).toBe(1);
  expect(events.length).toBeGreaterThan(0);
  expect(await database.getAll("unsent")).toEqual(events);
});

it("makes the copy of events to send from the events a version 2 database already held", async () => {
  await databaseAtVersion(2, async database => {
    await database.put("events", ANSWER);
  });

  const database = await openStudyDatabase();

  expect(await database.getAll("unsent")).toEqual([ANSWER]);
  expect(await database.getAll("events")).toEqual([ANSWER]);
});

it("keeps what a version 3 database held, and adds the stores for what the learner made", async () => {
  await databaseAtVersion(3, async database => {
    await database.put("events", ANSWER);
    await database.put("unsent", ANSWER);
  });

  const database = await openStudyDatabase();

  expect(await database.getAll("unsent")).toEqual([ANSWER]);
  expect(await database.getAll("events")).toEqual([ANSWER]);
  expect(database.objectStoreNames.contains("records")).toBe(true);
  expect(database.objectStoreNames.contains("unsent-records")).toBe(true);
  expect(database.transaction("records").store.keyPath).toEqual(RECORD_KEY);
});

it("lets go of its connection when something waits to delete the database, so the next use opens it again", async () => {
  const {deleteDB} = await import("idb");
  const first = await openStudyDatabase();

  await deleteDB("flashcards");
  const second = await openStudyDatabase();

  expect(second).not.toBe(first);
  expect(second.objectStoreNames.contains("cards")).toBe(true);
});
