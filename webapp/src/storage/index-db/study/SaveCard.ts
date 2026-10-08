import {openStudyDatabase} from "@src/storage/index-db/study/database/OpenStudyDatabase";
import {STUDY_STORES} from "@src/storage/index-db/study/database/StudyStores";
import {putEvents} from "@src/storage/index-db/study/database/PutEvents";
import type {CardEvent} from "@flashcards/shared/sync/card-events/CardEvent";
import type {StoredCard} from "@src/storage/index-db/study/types/StoredCard";
import type {StudyCard} from "@src/spaced-repetition/card/types/StudyCard";

/** Keeps a card as it now is, with no answer behind it: it was buried, suspended, brought back or marked hard. The event that did it is kept with it. */
export async function saveCard(card: StudyCard, event: CardEvent): Promise<void> {
  const database = await openStudyDatabase();
  const transaction = database.transaction([STUDY_STORES.cards, STUDY_STORES.events, STUDY_STORES.unsent], "readwrite");

  await Promise.all([
    transaction.objectStore(STUDY_STORES.cards).put({id: card.id, state: card.state} satisfies StoredCard),
    putEvents(transaction, [event]),
    transaction.done,
  ]);
}
