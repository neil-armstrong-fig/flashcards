import {buryCard} from "@src/spaced-repetition/card/setting-aside/BuryCard";
import {cardEventId} from "@flashcards/shared/sync/card-events/CardEventId";
import {markHard} from "@src/spaced-repetition/card/setting-aside/MarkHard";
import {newCardState} from "@src/spaced-repetition/card/NewCardState";
import {reviewCard} from "@src/spaced-repetition/scheduling/ReviewCard";
import {suspendCard} from "@src/spaced-repetition/card/setting-aside/SuspendCard";
import {unsuspendCard} from "@src/spaced-repetition/card/setting-aside/UnsuspendCard";
import type {CardEvent} from "@flashcards/shared/sync/card-events/CardEvent";
import type {Replay} from "@src/spaced-repetition/replay/types/Replay";

/**
 * One card after everything that happened to it, from every device. The events may come in any order: they are put in order of
 * when they happened (ties by id, so every device agrees) and applied one after another to a new card. `undefined` when there are
 * no events. A card's own events only: a card is its own history.
 */
export function replayEvents(cardId: string, events: readonly CardEvent[]): Replay | undefined {
  const ordered = events.filter(event => event.cardId === cardId).sort(byMomentThenId);
  const first = ordered[0];

  if (!first) {
    return undefined;
  }

  return ordered.reduce(applyEvent, {state: newCardState({due: new Date(first.at).toISOString()}), log: []});
}

function applyEvent({state, log}: Replay, event: CardEvent): Replay {
  const at = new Date(event.at);

  if (event.kind === "answer" && event.rating && event.retention) {
    const outcome = reviewCard({
      card: {id: event.cardId, state},
      rating: event.rating,
      now: at,
      desiredRetention: event.retention,
    });

    return {state: outcome.state, log: [...log, outcome.log]};
  }

  if (event.kind === "bury" && event.until) {
    return {state: buryCard(state, new Date(event.until)), log};
  }

  if (event.kind === "suspend") {
    return {state: suspendCard(state), log};
  }

  if (event.kind === "unsuspend") {
    return {state: unsuspendCard(state), log};
  }

  if (event.kind === "hard") {
    return {state: markHard(state, at), log};
  }

  return {state, log};
}

function byMomentThenId(a: CardEvent, b: CardEvent): number {
  const byMoment = new Date(a.at).getTime() - new Date(b.at).getTime();

  if (byMoment !== 0) {
    return byMoment;
  }

  return cardEventId(a).localeCompare(cardEventId(b));
}
