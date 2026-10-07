import {database} from "@src/database/Database";
import {cardEvents} from "@src/database/schema/CardEvents";
import type {CardEvent} from "@flashcards/shared/sync/card-events/CardEvent";

/** Keeps events for an account. One it already has does nothing, so a request sent twice (a response lost on the way) is safe. */
export async function saveCardEvents(userId: string, events: readonly CardEvent[]): Promise<void> {
  const [first, ...rest] = events.map(({cardId, at, kind, rating, retention, until}) => {
    return database
      .insert(cardEvents)
      .values({userId, cardId, at, kind, rating, retention, until})
      .onConflictDoNothing();
  });

  if (!first) {
    return;
  }

  await database.batch([first, ...rest]);
}
