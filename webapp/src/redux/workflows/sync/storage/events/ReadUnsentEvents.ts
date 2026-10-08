import {openStudyDatabase} from "@src/redux/slices/study/storage/indexed-db/OpenStudyDatabase";
import {readCardEvent} from "@flashcards/shared/sync/card-events/CardEvent";
import {STUDY_STORES} from "@src/redux/slices/study/storage/indexed-db/StudyStores";
import type {CardEvent} from "@flashcards/shared/sync/card-events/CardEvent";

/** Events this device made that the API has not been sent, at most `limit`, oldest first. */
export async function readUnsentEvents(limit: number): Promise<CardEvent[]> {
  const database = await openStudyDatabase();
  const stored = await database.getAll(STUDY_STORES.unsent, undefined, limit);

  return stored.flatMap(each => readCardEvent(each) ?? []);
}
