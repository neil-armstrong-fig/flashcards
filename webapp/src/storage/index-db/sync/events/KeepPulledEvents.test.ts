import {freshIndexedDb} from "@src/testing/environment/browser/FreshIndexedDb";
import {newCardState} from "@src/spaced-repetition/card/NewCardState";
import {reviewCard} from "@src/spaced-repetition/scheduling/ReviewCard";
import type {CardEvent} from "@flashcards/shared/sync/card-events/CardEvent";

vi.unmock("@src/storage/index-db/study/LoadStoredStudy");

beforeEach(() => {
  freshIndexedDb();
});

const AT = "2026-10-05T10:00:00.000Z";
const ANSWER: CardEvent = {cardId: "c1", kind: "answer", at: AT, rating: "good", retention: 0.9};

it("works the card out again from the pulled events, keeps it, and gives back what changed", async () => {
  const {keepPulledEvents} = await import("@src/storage/index-db/sync/events/KeepPulledEvents");
  const {loadStoredStudy} = await import("@src/storage/index-db/study/LoadStoredStudy");
  const expected = reviewCard({
    card: {id: "c1", state: newCardState({due: AT})},
    rating: "good",
    now: new Date(AT),
    desiredRetention: 0.9,
  });

  const progress = await keepPulledEvents([ANSWER]);

  expect(progress).toEqual({cards: {c1: expected.state}, log: [expected.log]});
  expect(await loadStoredStudy()).toEqual({cards: {c1: expected.state}, log: [expected.log]});
});

it("does nothing with an event this device already had", async () => {
  const {keepPulledEvents} = await import("@src/storage/index-db/sync/events/KeepPulledEvents");

  await keepPulledEvents([ANSWER]);

  expect(await keepPulledEvents([ANSWER])).toEqual({cards: {}, log: []});
});

it("does not make the pulled events ones to send", async () => {
  const {keepPulledEvents} = await import("@src/storage/index-db/sync/events/KeepPulledEvents");
  const {readUnsentEvents} = await import("@src/storage/index-db/sync/events/ReadUnsentEvents");

  await keepPulledEvents([ANSWER]);

  expect(await readUnsentEvents(10)).toEqual([]);
});
