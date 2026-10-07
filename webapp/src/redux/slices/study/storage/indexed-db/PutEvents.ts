import {STUDY_STORES} from "@src/redux/slices/study/storage/indexed-db/StudyStores";
import type {CardEvent} from "@flashcards/shared/sync/card-events/CardEvent";

/** Keeps events this device made: with the rest of the card's history, and in the copy still to be sent. The transaction must cover both stores. */
export function putEvents(transaction: IDBTransaction, events: readonly CardEvent[]): void {
  for (const event of events) {
    transaction.objectStore(STUDY_STORES.events).put(event);
    transaction.objectStore(STUDY_STORES.unsent).put(event);
  }
}
