import {openStudyDatabase} from "@src/redux/slices/study/storage/indexed-db/OpenStudyDatabase";
import {readRecordChange} from "@flashcards/shared/sync/records/RecordChange";
import {requestResult} from "@src/redux/shared/indexed-db/RequestResult";
import {STUDY_STORES} from "@src/redux/slices/study/storage/indexed-db/StudyStores";
import type {RecordChange} from "@flashcards/shared/sync/records/RecordChange";
import type {RecordKind} from "@flashcards/shared/sync/records/RecordKind";

/** The latest change this device knows of to one thing the learner made, whether made here or heard from another device. `undefined` where it has heard of none. */
export async function readLocalRecord(kind: RecordKind, id: string): Promise<RecordChange | undefined> {
  const database = await openStudyDatabase();
  const stored = await requestResult<unknown>(
    database.transaction(STUDY_STORES.records, "readonly").objectStore(STUDY_STORES.records).get([kind, id]),
  );

  return readRecordChange(stored);
}
