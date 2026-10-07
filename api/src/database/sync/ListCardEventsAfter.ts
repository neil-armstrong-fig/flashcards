import {and, asc, eq, gt} from "drizzle-orm";
import {database} from "@src/database/Database";
import {cardEvents} from "@src/database/schema/CardEvents";
import {readCardEvent} from "@flashcards/shared/sync/card-events/CardEvent";
import type {StoredCardEvent} from "@src/database/types/StoredCardEvent";

/** An account's events that came in after `cursor`, in the order they came in, at most `limit`. */
export async function listCardEventsAfter(userId: string, cursor: number, limit: number): Promise<StoredCardEvent[]> {
  const rows = await database
    .select()
    .from(cardEvents)
    .where(and(eq(cardEvents.userId, userId), gt(cardEvents.seq, cursor)))
    .orderBy(asc(cardEvents.seq))
    .limit(limit);

  return rows.flatMap(({seq, cardId, at, kind, rating, retention, until}) => {
    const event = readCardEvent({
      cardId,
      kind,
      at,
      rating: rating ?? undefined,
      retention: retention ?? undefined,
      until: until ?? undefined,
    });

    if (!event) {
      return [];
    }

    return [{seq, event}];
  });
}
