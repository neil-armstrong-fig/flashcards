import {openStudyDatabase} from "@src/redux/slices/study/storage/indexed-db/OpenStudyDatabase";
import {requestResult} from "@src/redux/shared/indexed-db/RequestResult";
import {STUDY_STORES} from "@src/redux/slices/study/storage/indexed-db/StudyStores";
import {transactionDone} from "@src/redux/shared/indexed-db/TransactionDone";
import type {RecordChange} from "@flashcards/shared/sync/records/RecordChange";

/**
 * Takes changes off the list still to be sent, once the API has them. A change made again while the sync was under way is a different
 * change (a later `at`) and stays, so it is sent the next time.
 */
export async function forgetSentRecords(sent: readonly RecordChange[]): Promise<void> {
  const database = await openStudyDatabase();
  const transaction = database.transaction(STUDY_STORES.unsentRecords, "readwrite");
  const store = transaction.objectStore(STUDY_STORES.unsentRecords);

  for (const {kind, id, at} of sent) {
    const waiting = await requestResult<{readonly at?: unknown} | undefined>(store.get([kind, id]));

    if (waiting?.at === at) {
      store.delete([kind, id]);
    }
  }

  await transactionDone(transaction);
}
