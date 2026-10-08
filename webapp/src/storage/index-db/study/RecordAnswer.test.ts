import {freshIndexedDb} from "@src/testing/environment/browser/FreshIndexedDb";
import {newCardState} from "@src/spaced-repetition/card/NewCardState";
import {reviewCard} from "@src/spaced-repetition/scheduling/ReviewCard";
import type {CardEvent} from "@flashcards/shared/sync/card-events/CardEvent";

vi.unmock("@src/storage/index-db/study/LoadStoredStudy");
vi.unmock("@src/storage/index-db/study/RecordAnswer");

beforeEach(() => {
  freshIndexedDb();
});

it("keeps the card, the answer and the events, the events as ones to send", async () => {
  const {recordAnswer} = await import("@src/storage/index-db/study/RecordAnswer");
  const {loadStoredStudy} = await import("@src/storage/index-db/study/LoadStoredStudy");
  const {readUnsentEvents} = await import("@src/storage/index-db/sync/events/ReadUnsentEvents");
  const now = new Date("2026-10-05T10:00:00.000Z");
  const answered = reviewCard({
    card: {id: "c1", state: newCardState({due: now.toISOString()})},
    rating: "good",
    now,
    desiredRetention: 0.9,
  });
  const event: CardEvent = {cardId: "c1", kind: "answer", at: now.toISOString(), rating: "good", retention: 0.9};

  await recordAnswer({id: "c1", state: answered.state}, answered.log, [event]);

  expect((await loadStoredStudy()).cards).toEqual({c1: answered.state});
  expect(await readUnsentEvents(10)).toEqual([event]);
});
