import {STUDY_STORES} from "@src/redux/slices/study/storage/indexed-db/StudyStores";

const DATABASE_NAME = "flashcards";
const DATABASE_VERSION = 1;

/** Opened once, on first use, and kept for as long as the page lives. */
let database: Promise<IDBDatabase> | undefined;

/** The browser's IndexedDB holding study progress, because a review log outgrows localStorage and images will follow. */
export function openStudyDatabase(): Promise<IDBDatabase> {
  database ??= new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

    request.onupgradeneeded = (): void => {
      request.result.createObjectStore(STUDY_STORES.cards, {keyPath: "id"});
      request.result.createObjectStore(STUDY_STORES.log, {keyPath: ["cardId", "reviewedAt"]});
    };
    request.onsuccess = (): void => resolve(request.result);
    request.onerror = (): void => reject(request.error);
  });

  return database;
}
