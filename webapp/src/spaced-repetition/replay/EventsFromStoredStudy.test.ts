import {eventsFromStoredStudy} from "@src/spaced-repetition/replay/EventsFromStoredStudy";
import {markHard} from "@src/spaced-repetition/card/setting-aside/MarkHard";
import {newCardState} from "@src/spaced-repetition/card/NewCardState";
import {replayEvents} from "@src/spaced-repetition/replay/ReplayEvents";
import {reviewCard} from "@src/spaced-repetition/scheduling/ReviewCard";
import {buryCard} from "@src/spaced-repetition/card/setting-aside/BuryCard";
import {suspendCard} from "@src/spaced-repetition/card/setting-aside/SuspendCard";
import type {CardState} from "@src/spaced-repetition/card/types/CardState";
import type {ReviewLogEntry} from "@src/spaced-repetition/scheduling/types/ReviewLogEntry";

const retention = 0.9;
const start = new Date("2026-10-05T10:00:00.000Z");
const later = new Date("2026-10-06T10:00:00.000Z");
const now = new Date("2026-10-07T10:00:00.000Z");

function answered(state: CardState, at: Date, log: ReviewLogEntry[]): CardState {
  const outcome = reviewCard({card: {id: "c1", state}, rating: "good", now: at, desiredRetention: retention});

  log.push(outcome.log);

  return outcome.state;
}

it("gives events whose replay is the card as it stands, answered, hard, buried and suspended", () => {
  const log: ReviewLogEntry[] = [];
  const twice = answered(answered(newCardState({due: start.toISOString()}), start, log), later, log);
  const stored = suspendCard(buryCard(markHard(twice, later), new Date("2026-10-08T03:00:00.000Z")));
  const events = eventsFromStoredStudy({cards: {c1: stored}, log, retention, now});

  expect(replayEvents("c1", events)?.state).toEqual(stored);
});

it("gives events for a card that was set aside without ever being answered", () => {
  const stored = suspendCard(newCardState({due: now.toISOString()}));
  const events = eventsFromStoredStudy({cards: {c1: stored}, log: [], retention, now});

  expect(events).toEqual([{cardId: "c1", kind: "suspend", at: now.toISOString()}]);
});

it("gives nothing for a card that is only answered and has no log", () => {
  expect(eventsFromStoredStudy({cards: {c1: newCardState({due: now.toISOString()})}, log: [], retention, now})).toEqual(
    [],
  );
});
