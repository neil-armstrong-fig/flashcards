import {openStudyDatabase} from "@src/redux/slices/study/storage/indexed-db/OpenStudyDatabase";
import {STUDY_STORES} from "@src/redux/slices/study/storage/indexed-db/StudyStores";
import {transactionDone} from "@src/redux/shared/indexed-db/TransactionDone";
import type {RecordChange} from "@flashcards/shared/sync/records/RecordChange";

/** Keeps a change the learner has just made to something of theirs: as the latest this device knows of, and as one the API has not been sent. */
export async function keepLocalRecord(change: RecordChange): Promise<void> {
  const database = await openStudyDatabase();
  const transaction = database.transaction([STUDY_STORES.records, STUDY_STORES.unsentRecords], "readwrite");

  transaction.objectStore(STUDY_STORES.records).put(change);
  transaction.objectStore(STUDY_STORES.unsentRecords).put(change);

  await transactionDone(transaction);
}
