import {openStudyDatabase} from "@src/redux/slices/study/storage/indexed-db/OpenStudyDatabase";
import {readRecordChange} from "@flashcards/shared/sync/records/RecordChange";
import {STUDY_STORES} from "@src/redux/slices/study/storage/indexed-db/StudyStores";
import type {RecordChange} from "@flashcards/shared/sync/records/RecordChange";

/** Changes to what the learner made that this device has not sent the API, at most `limit`. */
export async function readUnsentRecords(limit: number): Promise<RecordChange[]> {
  const database = await openStudyDatabase();
  const stored = await database.getAll(STUDY_STORES.unsentRecords, undefined, limit);

  return stored.flatMap(each => readRecordChange(each) ?? []);
}
