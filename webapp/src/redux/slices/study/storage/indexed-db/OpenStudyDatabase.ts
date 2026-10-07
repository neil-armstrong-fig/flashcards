import {backfillEvents} from "@src/redux/slices/study/storage/indexed-db/BackfillEvents";
import {markEventsUnsent} from "@src/redux/slices/study/storage/indexed-db/MarkEventsUnsent";
import {STUDY_STORES} from "@src/redux/slices/study/storage/indexed-db/StudyStores";

const EVENT_KEY = ["cardId", "at", "kind"];
const DATABASE_NAME = "flashcards";
const DATABASE_VERSION = 4;
const RECORD_KEY = ["kind", "id"];

/** Opened once, on first use, and kept for as long as the page lives. */
let database: Promise<IDBDatabase> | undefined;

/** The browser's IndexedDB holding study progress, because a review log outgrows localStorage and images will follow. */
export function openStudyDatabase(): Promise<IDBDatabase> {
  database ??= new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

    request.onupgradeneeded = (event): void => {
      if (event.oldVersion < 1) {
        request.result.createObjectStore(STUDY_STORES.cards, {keyPath: "id"});
        request.result.createObjectStore(STUDY_STORES.log, {keyPath: ["cardId", "reviewedAt"]});
      }

      if (event.oldVersion < 2 && request.transaction) {
        request.result.createObjectStore(STUDY_STORES.events, {keyPath: EVENT_KEY});
        request.result.createObjectStore(STUDY_STORES.unsent, {keyPath: EVENT_KEY});
        backfillEvents(request.transaction);
      }

      if (event.oldVersion < 4) {
        request.result.createObjectStore(STUDY_STORES.records, {keyPath: RECORD_KEY});
        request.result.createObjectStore(STUDY_STORES.unsentRecords, {keyPath: RECORD_KEY});
      }

      if (event.oldVersion === 2 && request.transaction) {
        request.result.createObjectStore(STUDY_STORES.unsent, {keyPath: EVENT_KEY});
        markEventsUnsent(request.transaction);
      }
    };
    request.onsuccess = (): void => resolve(request.result);
    request.onerror = (): void => reject(request.error);
  });

  return database;
}
