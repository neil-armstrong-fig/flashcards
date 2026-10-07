import {openStudyDatabase} from "@src/redux/slices/study/storage/indexed-db/OpenStudyDatabase";
import {STUDY_STORES} from "@src/redux/slices/study/storage/indexed-db/StudyStores";
import {transactionDone} from "@src/redux/shared/indexed-db/TransactionDone";
import type {RecordChange} from "@flashcards/shared/sync/records/RecordChange";

/** Remembers a change heard from another device as the latest this device knows of. It is not one to send: the API has it already. */
export async function keepHeardRecord(change: RecordChange): Promise<void> {
  const database = await openStudyDatabase();
  const transaction = database.transaction(STUDY_STORES.records, "readwrite");

  transaction.objectStore(STUDY_STORES.records).put(change);

  await transactionDone(transaction);
}
