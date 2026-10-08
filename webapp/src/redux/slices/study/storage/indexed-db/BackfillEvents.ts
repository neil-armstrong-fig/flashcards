import {eventsFromStoredStudy} from "@src/spaced-repetition/replay/EventsFromStoredStudy";
import {loadSettings} from "@src/redux/slices/settings/storage/LoadSettings";
import {putEvents} from "@src/redux/slices/study/storage/indexed-db/PutEvents";
import {readCardState} from "@src/spaced-repetition/card/ReadCardState";
import {readReviewLogEntry} from "@src/spaced-repetition/scheduling/ReadReviewLogEntry";
import {STUDY_STORES} from "@src/redux/slices/study/storage/indexed-db/StudyStores";
import type {CardState} from "@src/spaced-repetition/card/types/CardState";
import type {ReviewLogEntry} from "@src/spaced-repetition/scheduling/types/ReviewLogEntry";
import type {StudyTransaction} from "@src/redux/slices/study/storage/indexed-db/types/StudyTransaction";
import type {StoredCard} from "@src/redux/slices/study/storage/types/StoredCard";

/**
 * Part of upgrading to the events store: writes the events a device that predates it would have, from the cards and the log it
 * already holds, all of them still to be sent. It runs in the upgrade's own transaction, so the store is never seen half filled.
 */
export async function backfillEvents(upgrade: StudyTransaction): Promise<void> {
  const [storedCards, storedLog] = await Promise.all([
    upgrade.objectStore(STUDY_STORES.cards).getAll(),
    upgrade.objectStore(STUDY_STORES.log).getAll(),
  ]);
  const cards = cardsOf(storedCards);
  const log = storedLog.map(readReviewLogEntry).filter((entry): entry is ReviewLogEntry => entry !== undefined);
  const retention = loadSettings().desiredRetentionPercent / 100;
  const events = eventsFromStoredStudy({cards, log, retention, now: new Date()});

  await putEvents(upgrade, events);
}

function cardsOf(stored: readonly unknown[]): Record<string, CardState> {
  const cards: Record<string, CardState> = {};

  for (const record of stored) {
    const id = (record as Partial<StoredCard> | null)?.id;
    const state = readCardState((record as Partial<StoredCard> | null)?.state);

    if (typeof id === "string" && state) {
      cards[id] = state;
    }
  }

  return cards;
}
