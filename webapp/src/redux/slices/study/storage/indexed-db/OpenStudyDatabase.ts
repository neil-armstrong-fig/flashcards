import {backfillEvents} from "@src/redux/slices/study/storage/indexed-db/BackfillEvents";
import {markEventsUnsent} from "@src/redux/slices/study/storage/indexed-db/MarkEventsUnsent";
import {openDB} from "idb";
import {STUDY_STORES} from "@src/redux/slices/study/storage/indexed-db/StudyStores";
import type {IDBPDatabase} from "idb";
import type {StudyDatabase} from "@src/redux/slices/study/storage/indexed-db/types/StudyDatabase";

const EVENT_KEY = ["cardId", "at", "kind"];
const DATABASE_NAME = "flashcards";
const DATABASE_VERSION = 4;
const RECORD_KEY = ["kind", "id"];

/** Opened once, on first use, and kept for as long as the page lives. */
let database: Promise<IDBPDatabase<StudyDatabase>> | undefined;

/** The browser's IndexedDB holding study progress, because a review log outgrows localStorage and images will follow. */
export function openStudyDatabase(): Promise<IDBPDatabase<StudyDatabase>> {
  database ??= openDB<StudyDatabase>(DATABASE_NAME, DATABASE_VERSION, {
    async upgrade(upgrading, oldVersion, _newVersion, transaction): Promise<void> {
      if (oldVersion < 1) {
        upgrading.createObjectStore(STUDY_STORES.cards, {keyPath: "id"});
        upgrading.createObjectStore(STUDY_STORES.log, {keyPath: ["cardId", "reviewedAt"]});
      }

      if (oldVersion < 2) {
        upgrading.createObjectStore(STUDY_STORES.events, {keyPath: EVENT_KEY});
        upgrading.createObjectStore(STUDY_STORES.unsent, {keyPath: EVENT_KEY});
      }

      if (oldVersion < 4) {
        upgrading.createObjectStore(STUDY_STORES.records, {keyPath: RECORD_KEY});
        upgrading.createObjectStore(STUDY_STORES.unsentRecords, {keyPath: RECORD_KEY});
      }

      if (oldVersion === 2) {
        upgrading.createObjectStore(STUDY_STORES.unsent, {keyPath: EVENT_KEY});
      }

      if (oldVersion < 2) {
        await backfillEvents(transaction);
      }

      if (oldVersion === 2) {
        await markEventsUnsent(transaction);
      }
    },
  });

  return database;
}
