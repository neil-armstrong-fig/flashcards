import {STUDY_STORES} from "@src/redux/slices/study/storage/indexed-db/StudyStores";
import type {CardEvent} from "@flashcards/shared/sync/card-events/CardEvent";
import type {StudyTransaction} from "@src/redux/slices/study/storage/indexed-db/types/StudyTransaction";

/** Keeps events this device made: with the rest of the card's history, and in the copy still to be sent. The transaction must cover both stores. */
export async function putEvents(transaction: StudyTransaction, events: readonly CardEvent[]): Promise<void> {
  await Promise.all(
    events.flatMap(event => [
      transaction.objectStore(STUDY_STORES.events).put(event),
      transaction.objectStore(STUDY_STORES.unsent).put(event),
    ]),
  );
}
