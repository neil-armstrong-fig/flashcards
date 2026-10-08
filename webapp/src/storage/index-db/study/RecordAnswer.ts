import {openStudyDatabase} from "@src/storage/index-db/study/database/OpenStudyDatabase";
import {STUDY_STORES} from "@src/storage/index-db/study/database/StudyStores";
import {putEvents} from "@src/storage/index-db/study/database/PutEvents";
import type {CardEvent} from "@flashcards/shared/sync/card-events/CardEvent";
import type {ReviewLogEntry} from "@src/spaced-repetition/scheduling/types/ReviewLogEntry";
import type {StoredCard} from "@src/storage/index-db/study/types/StoredCard";
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

  await Promise.all([
    transaction.objectStore(STUDY_STORES.cards).put({id: card.id, state: card.state} satisfies StoredCard),
    transaction.objectStore(STUDY_STORES.log).put(entry),
    putEvents(transaction, events),
    transaction.done,
  ]);
}
