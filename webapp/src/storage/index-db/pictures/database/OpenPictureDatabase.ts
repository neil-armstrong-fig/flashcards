import {openDB} from "idb";
import {PICTURE_STORE} from "@src/storage/index-db/pictures/database/PictureStore";
import type {IDBPDatabase} from "idb";
import type {PictureDatabase} from "@src/storage/index-db/pictures/database/types/PictureDatabase";

const DATABASE_NAME = "flashcards-pictures";
const DATABASE_VERSION = 1;

/** Opened once, on first use, and kept for as long as the page lives. */
let database: Promise<IDBPDatabase<PictureDatabase>> | undefined;

/** The pictures' own IndexedDB database, so the study database's version and upgrade are left alone. */
export function openPictureDatabase(): Promise<IDBPDatabase<PictureDatabase>> {
  database ??= openDB<PictureDatabase>(DATABASE_NAME, DATABASE_VERSION, {
    upgrade(upgrading): void {
      upgrading.createObjectStore(PICTURE_STORE);
    },
  });

  return database;
}
