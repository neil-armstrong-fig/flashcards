import type {CardEvent} from "@flashcards/shared/sync/card-events/CardEvent";

/** What makes an event the same event on every device: its card, its moment and its kind. Sending it twice changes nothing. */
export function cardEventId(event: CardEvent): string {
  return `${event.cardId}|${event.at}|${event.kind}`;
}
