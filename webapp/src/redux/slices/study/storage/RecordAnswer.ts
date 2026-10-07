import {openStudyDatabase} from "@src/redux/slices/study/storage/indexed-db/OpenStudyDatabase";
import {STUDY_STORES} from "@src/redux/slices/study/storage/indexed-db/StudyStores";
import {putEvents} from "@src/redux/slices/study/storage/indexed-db/PutEvents";
import {transactionDone} from "@src/redux/shared/indexed-db/TransactionDone";
import type {CardEvent} from "@flashcards/shared/sync/card-events/CardEvent";
import type {ReviewLogEntry} from "@src/spaced-repetition/scheduling/types/ReviewLogEntry";
import type {StoredCard} from "@src/redux/slices/study/storage/types/StoredCard";
import type {StudyCard} from "@src/spaced-repetition/card/types/StudyCard";

/** Keeps a card's new state, the log entry for the answer that made it and the events behind it (the answer, and a suspend if it set the card aside), together or not at all. */
export async function recordAnswer(
  card: StudyCard,
  entry: ReviewLogEntry,
  events: readonly CardEvent[],
): Promise<void> {
  const database = await openStudyDatabase();
  const transaction = database.transaction(
    [STUDY_STORES.cards, STUDY_STORES.log, STUDY_STORES.events, STUDY_STORES.unsent],
    "readwrite",
  );

  transaction.objectStore(STUDY_STORES.cards).put({id: card.id, state: card.state} satisfies StoredCard);
  transaction.objectStore(STUDY_STORES.log).put(entry);

  putEvents(transaction, events);

  await transactionDone(transaction);
}
