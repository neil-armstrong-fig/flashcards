import {openStudyDatabase} from "@src/storage/index-db/study/database/OpenStudyDatabase";
import {STUDY_STORES} from "@src/storage/index-db/study/database/StudyStores";
import type {RecordChange} from "@flashcards/shared/sync/records/RecordChange";

/** Remembers a change heard from another device as the latest this device knows of. It is not one to send: the API has it already. */
export async function keepHeardRecord(change: RecordChange): Promise<void> {
  const database = await openStudyDatabase();

  await database.put(STUDY_STORES.records, change);
}
