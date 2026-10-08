import type {IDBPTransaction, StoreNames} from "idb";
import type {StudyDatabase} from "@src/storage/index-db/study/database/types/StudyDatabase";

/** A transaction on the study database that may write, whichever of its stores it covers: a write, or the upgrade itself. */
export type StudyTransaction = IDBPTransaction<
  StudyDatabase,
  StoreNames<StudyDatabase>[],
  "readwrite" | "versionchange"
>;
