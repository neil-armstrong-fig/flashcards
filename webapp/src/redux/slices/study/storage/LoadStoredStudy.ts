import {openStudyDatabase} from "@src/redux/slices/study/storage/indexed-db/OpenStudyDatabase";
import {readCardState} from "@src/spaced-repetition/card/ReadCardState";
import {readReviewLogEntry} from "@src/spaced-repetition/scheduling/ReadReviewLogEntry";
import {requestResult} from "@src/redux/shared/indexed-db/RequestResult";
import {STUDY_STORES} from "@src/redux/slices/study/storage/indexed-db/StudyStores";
import type {CardState} from "@src/spaced-repetition/card/types/CardState";
import type {ReviewLogEntry} from "@src/spaced-repetition/scheduling/types/ReviewLogEntry";
import type {StoredCard} from "@src/redux/slices/study/storage/types/StoredCard";
import type {StoredStudy} from "@src/redux/slices/study/storage/types/StoredStudy";

/** Every card and every answer kept on this device. Each stored value is checked on the way in; anything unreadable is dropped rather than trusted. */
export async function loadStoredStudy(): Promise<StoredStudy> {
  const database = await openStudyDatabase();
  const transaction = database.transaction([STUDY_STORES.cards, STUDY_STORES.log], "readonly");
  const [storedCards, storedLog] = await Promise.all([
    requestResult<unknown[]>(transaction.objectStore(STUDY_STORES.cards).getAll()),
    requestResult<unknown[]>(transaction.objectStore(STUDY_STORES.log).getAll()),
  ]);

  const cards: Record<string, CardState> = {};

  for (const stored of storedCards) {
    const id = (stored as Partial<StoredCard> | null)?.id;
    const state = readCardState((stored as Partial<StoredCard> | null)?.state);

    if (typeof id === "string" && state) {
      cards[id] = state;
    }
  }

  const log = storedLog.map(readReviewLogEntry).filter((entry): entry is ReviewLogEntry => entry !== undefined);

  return {cards, log};
}
