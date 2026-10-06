import {PICTURE_STORE} from "@src/redux/slices/card-pictures/indexed-db/PictureStore";

const DATABASE_NAME = "language-learning-pictures";
const DATABASE_VERSION = 1;

/** Opened once, on first use, and kept for as long as the page lives. */
let database: Promise<IDBDatabase> | undefined;

/** The pictures' own IndexedDB database, so the study database's version and upgrade are left alone. */
export function openPictureDatabase(): Promise<IDBDatabase> {
  database ??= new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

    request.onupgradeneeded = (): void => {
      request.result.createObjectStore(PICTURE_STORE);
    };
    request.onsuccess = (): void => resolve(request.result);
    request.onerror = (): void => reject(request.error);
  });

  return database;
}
