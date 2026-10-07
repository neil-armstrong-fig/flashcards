import type {CardEvent} from "@flashcards/shared/sync/card-events/CardEvent";

/** An event as the server holds it: with the place it came in the account's history, which is what a device's cursor counts. */
export interface StoredCardEvent {
  readonly seq: number;
  readonly event: CardEvent;
}
