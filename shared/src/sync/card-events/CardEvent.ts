import {CARD_EVENT_KINDS} from "@flashcards/shared/sync/card-events/CardEventKind";
import {RATINGS} from "@flashcards/shared/study/Rating";
import type {CardEventKind} from "@flashcards/shared/sync/card-events/CardEventKind";
import type {Rating} from "@flashcards/shared/study/Rating";

/**
 * One thing that happened to a card, as the device and the API both keep it. A card's state is whatever replaying its events in
 * order gives, so an event holds everything the replay would otherwise read from settings.
 */
export interface CardEvent {
  readonly cardId: string;
  readonly kind: CardEventKind;
  /** When it happened, as an ISO timestamp. */
  readonly at: string;
  /** An answer's rating. Present for `answer` only. */
  readonly rating?: Rating;
  /** The chance of remembering, from 0 to 1, that the scheduler aimed for. Present for `answer` only. */
  readonly retention?: number;
  /** When a buried card comes back, as an ISO timestamp. Present for `bury` only. */
  readonly until?: string;
}

/** An event from storage or the network, or `undefined` if what arrived is not one. */
export function readCardEvent(value: unknown): CardEvent | undefined {
  if (typeof value !== "object" || value === null) {
    return undefined;
  }

  const {cardId, kind, at, rating, retention, until} = value as Record<string, unknown>;

  if (typeof cardId !== "string" || !CARD_EVENT_KINDS.some(known => known === kind) || !isTimestamp(at)) {
    return undefined;
  }

  if (kind === "answer") {
    if (!RATINGS.some(known => known === rating) || typeof retention !== "number" || retention <= 0 || retention >= 1) {
      return undefined;
    }

    return {cardId, kind, at, rating: rating as Rating, retention};
  }

  if (kind === "bury") {
    if (!isTimestamp(until)) {
      return undefined;
    }

    return {cardId, kind, at, until};
  }

  return {cardId, kind: kind as CardEventKind, at};
}

function isTimestamp(value: unknown): value is string {
  return typeof value === "string" && !Number.isNaN(new Date(value).getTime());
}
