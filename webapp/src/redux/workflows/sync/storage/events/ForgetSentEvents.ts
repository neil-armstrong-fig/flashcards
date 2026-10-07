import {openStudyDatabase} from "@src/redux/slices/study/storage/indexed-db/OpenStudyDatabase";
import {STUDY_STORES} from "@src/redux/slices/study/storage/indexed-db/StudyStores";
import {transactionDone} from "@src/redux/shared/indexed-db/TransactionDone";
import type {CardEvent} from "@flashcards/shared/sync/card-events/CardEvent";

/** Takes events off the list still to be sent, once the API has them. They stay in the card's history. */
export async function forgetSentEvents(events: readonly CardEvent[]): Promise<void> {
  const database = await openStudyDatabase();
  const transaction = database.transaction(STUDY_STORES.unsent, "readwrite");

  for (const {cardId, at, kind} of events) {
    transaction.objectStore(STUDY_STORES.unsent).delete([cardId, at, kind]);
  }

  await transactionDone(transaction);
}
