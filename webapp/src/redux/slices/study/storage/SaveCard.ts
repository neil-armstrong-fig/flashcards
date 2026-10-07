import {openStudyDatabase} from "@src/redux/slices/study/storage/indexed-db/OpenStudyDatabase";
import {STUDY_STORES} from "@src/redux/slices/study/storage/indexed-db/StudyStores";
import {putEvents} from "@src/redux/slices/study/storage/indexed-db/PutEvents";
import {transactionDone} from "@src/redux/shared/indexed-db/TransactionDone";
import type {CardEvent} from "@flashcards/shared/sync/card-events/CardEvent";
import type {StoredCard} from "@src/redux/slices/study/storage/types/StoredCard";
import type {StudyCard} from "@src/spaced-repetition/card/types/StudyCard";

/** Keeps a card as it now is, with no answer behind it: it was buried, suspended, brought back or marked hard. The event that did it is kept with it. */
export async function saveCard(card: StudyCard, event: CardEvent): Promise<void> {
  const database = await openStudyDatabase();
  const transaction = database.transaction([STUDY_STORES.cards, STUDY_STORES.events, STUDY_STORES.unsent], "readwrite");

  transaction.objectStore(STUDY_STORES.cards).put({id: card.id, state: card.state} satisfies StoredCard);
  putEvents(transaction, [event]);

  await transactionDone(transaction);
}
