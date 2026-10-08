import {openStudyDatabase} from "@src/storage/index-db/study/database/OpenStudyDatabase";
import {STUDY_STORES} from "@src/storage/index-db/study/database/StudyStores";
import type {CardEvent} from "@flashcards/shared/sync/card-events/CardEvent";

/** Takes events off the list still to be sent, once the API has them. They stay in the card's history. */
export async function forgetSentEvents(events: readonly CardEvent[]): Promise<void> {
  const database = await openStudyDatabase();
  const transaction = database.transaction(STUDY_STORES.unsent, "readwrite");

  await Promise.all([
    ...events.map(({cardId, at, kind}) => transaction.objectStore(STUDY_STORES.unsent).delete([cardId, at, kind])),
    transaction.done,
  ]);
}
