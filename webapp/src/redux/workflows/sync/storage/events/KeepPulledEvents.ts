import {openStudyDatabase} from "@src/redux/slices/study/storage/indexed-db/OpenStudyDatabase";
import {readCardEvent} from "@flashcards/shared/sync/card-events/CardEvent";
import {replayEvents} from "@src/spaced-repetition/replay/ReplayEvents";
import {STUDY_STORES} from "@src/redux/slices/study/storage/indexed-db/StudyStores";
import type {CardEvent} from "@flashcards/shared/sync/card-events/CardEvent";
import type {CardState} from "@src/spaced-repetition/card/types/CardState";
import type {PulledProgress} from "@src/redux/slices/study/types/PulledProgress";
import type {ReviewLogEntry} from "@src/spaced-repetition/scheduling/types/ReviewLogEntry";
import type {StoredCard} from "@src/redux/slices/study/storage/types/StoredCard";

/**
 * Keeps the events that came from the API that this device did not already have, and works out again each card they touch from its
 * whole history, here and there. All in one transaction, so an answer given on this device meanwhile is in the history that is
 * replayed and is never written over. Gives back the cards and answers that changed, for the screen.
 */
export async function keepPulledEvents(pulled: readonly CardEvent[]): Promise<PulledProgress> {
  const database = await openStudyDatabase();
  const transaction = database.transaction([STUDY_STORES.cards, STUDY_STORES.log, STUDY_STORES.events], "readwrite");
  const events = transaction.objectStore(STUDY_STORES.events);
  const fresh: CardEvent[] = [];
  const writes: Promise<unknown>[] = [];

  for (const event of pulled) {
    const known = await events.getKey([event.cardId, event.at, event.kind]);

    if (known === undefined) {
      fresh.push(event);
      writes.push(events.put(event));
    }
  }

  const cards: Record<string, CardState> = {};
  const log: ReviewLogEntry[] = [];

  for (const cardId of new Set(fresh.map(event => event.cardId))) {
    const history = await events.getAll(IDBKeyRange.bound([cardId], [cardId, "￿"]));
    const replay = replayEvents(
      cardId,
      history.flatMap(each => readCardEvent(each) ?? []),
    );

    if (replay) {
      cards[cardId] = replay.state;
      log.push(...replay.log);
      writes.push(
        transaction.objectStore(STUDY_STORES.cards).put({id: cardId, state: replay.state} satisfies StoredCard),
      );

      for (const entry of replay.log) {
        writes.push(transaction.objectStore(STUDY_STORES.log).put(entry));
      }
    }
  }

  await Promise.all([...writes, transaction.done]);

  return {cards, log};
}
