import {openStudyDatabase} from "@src/storage/index-db/study/database/OpenStudyDatabase";
import {readRecordChange} from "@flashcards/shared/sync/records/RecordChange";
import {STUDY_STORES} from "@src/storage/index-db/study/database/StudyStores";
import type {RecordChange} from "@flashcards/shared/sync/records/RecordChange";

/**
 * Takes changes off the list still to be sent, once the API has them. A change made again while the sync was under way is a different
 * change (a later `at`) and stays, so it is sent the next time.
 */
export async function forgetSentRecords(sent: readonly RecordChange[]): Promise<void> {
  const database = await openStudyDatabase();
  const transaction = database.transaction(STUDY_STORES.unsentRecords, "readwrite");
  const store = transaction.objectStore(STUDY_STORES.unsentRecords);

  const deletions: Promise<void>[] = [];

  for (const {kind, id, at} of sent) {
    const waiting = readRecordChange(await store.get([kind, id]));

    if (waiting?.at === at) {
      deletions.push(store.delete([kind, id]));
    }
  }

  await Promise.all([...deletions, transaction.done]);
}
