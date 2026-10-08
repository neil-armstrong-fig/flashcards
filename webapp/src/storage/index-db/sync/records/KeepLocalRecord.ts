import {openStudyDatabase} from "@src/storage/index-db/study/database/OpenStudyDatabase";
import {STUDY_STORES} from "@src/storage/index-db/study/database/StudyStores";
import type {RecordChange} from "@flashcards/shared/sync/records/RecordChange";

/** Keeps a change the learner has just made to something of theirs: as the latest this device knows of, and as one the API has not been sent. */
export async function keepLocalRecord(change: RecordChange): Promise<void> {
  const database = await openStudyDatabase();
  const transaction = database.transaction([STUDY_STORES.records, STUDY_STORES.unsentRecords], "readwrite");

  await Promise.all([
    transaction.objectStore(STUDY_STORES.records).put(change),
    transaction.objectStore(STUDY_STORES.unsentRecords).put(change),
    transaction.done,
  ]);
}
