import {openStudyDatabase} from "@src/redux/slices/study/storage/indexed-db/OpenStudyDatabase";
import {STUDY_STORES} from "@src/redux/slices/study/storage/indexed-db/StudyStores";
import {transactionDone} from "@src/redux/shared/indexed-db/TransactionDone";
import type {StoredCard} from "@src/redux/slices/study/storage/types/StoredCard";
import type {StudyCard} from "@src/spaced-repetition/card/types/StudyCard";

/** Keeps a card as it now is, with no answer behind it: it was buried, suspended or brought back. */
export async function saveCard(card: StudyCard): Promise<void> {
  const database = await openStudyDatabase();
  const transaction = database.transaction(STUDY_STORES.cards, "readwrite");

  transaction.objectStore(STUDY_STORES.cards).put({id: card.id, state: card.state} satisfies StoredCard);

  await transactionDone(transaction);
}
