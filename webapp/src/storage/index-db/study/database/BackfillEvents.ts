import {eventsFromStoredStudy} from "@src/spaced-repetition/replay/EventsFromStoredStudy";
import {putEvents} from "@src/storage/index-db/study/database/PutEvents";
import {readCardState} from "@src/spaced-repetition/card/ReadCardState";
import {readReviewLogEntry} from "@src/spaced-repetition/scheduling/ReadReviewLogEntry";
import {readStoredSettings} from "@src/storage/local-storage/settings/ReadStoredSettings";
import {STUDY_STORES} from "@src/storage/index-db/study/database/StudyStores";
import type {CardState} from "@src/spaced-repetition/card/types/CardState";
import type {ReviewLogEntry} from "@src/spaced-repetition/scheduling/types/ReviewLogEntry";
import type {StudyTransaction} from "@src/storage/index-db/study/database/types/StudyTransaction";
import type {StoredCard} from "@src/storage/index-db/study/types/StoredCard";

const DEFAULT_RETENTION = 0.9;

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
  const retention = retentionOf(readStoredSettings());
  const events = eventsFromStoredStudy({cards, log, retention, now: new Date()});

  await putEvents(upgrade, events);
}

/**
 * The retention the learner chose, as a fraction, or the one a new learner starts with. This runs only for a device that predates the
 * events store, so it reads the stored settings as they were then: a whole percentage from 70 to 97, or nothing.
 */
function retentionOf(settings: unknown): number {
  const percent = (settings as {desiredRetentionPercent?: unknown} | null)?.desiredRetentionPercent;

  if (typeof percent !== "number" || !Number.isInteger(percent) || percent < 70 || percent > 97) {
    return DEFAULT_RETENTION;
  }

  return percent / 100;
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
