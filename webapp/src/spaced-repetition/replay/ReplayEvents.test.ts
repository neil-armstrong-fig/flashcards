import {newCardState} from "@src/spaced-repetition/card/NewCardState";
import {replayEvents} from "@src/spaced-repetition/replay/ReplayEvents";
import {reviewCard} from "@src/spaced-repetition/scheduling/ReviewCard";
import type {Rating} from "@flashcards/shared/study/Rating";
import type {CardEvent} from "@flashcards/shared/sync/card-events/CardEvent";

const first = new Date("2026-10-05T10:00:00.000Z");
const second = new Date("2026-10-05T10:10:00.000Z");
const third = new Date("2026-10-06T10:00:00.000Z");
interface AnswerProps {
  readonly cardId: string;
  readonly at: Date;
  readonly rating: Rating;
}

function answer({cardId = "c1", at = first, rating = "good"}: Partial<AnswerProps> = {}): CardEvent {
  return {cardId, kind: "answer", at: at.toISOString(), rating, retention: 0.9};
}

it("is undefined for a card with no events", () => {
  expect(replayEvents("c1", [])).toBeUndefined();
  expect(replayEvents("c1", [answer({cardId: "other"})])).toBeUndefined();
});

it("gives what answering one card after another gives", () => {
  const one = reviewCard({
    card: {id: "c1", state: newCardState({due: first.toISOString()})},
    rating: "good",
    now: first,
    desiredRetention: 0.9,
  });
  const two = reviewCard({card: {id: "c1", state: one.state}, rating: "easy", now: second, desiredRetention: 0.9});

  expect(replayEvents("c1", [answer({at: first}), answer({at: second, rating: "easy"})])).toEqual({
    state: two.state,
    log: [one.log, two.log],
  });
});

it("gives the same state whatever order the events arrive in", () => {
  const events = [answer({at: first}), answer({at: second}), answer({at: third, rating: "again"})];

  expect(replayEvents("c1", [...events].reverse())).toEqual(replayEvents("c1", events));
});

it("keeps both devices' answers when each answered the same new card", () => {
  const phone = answer({at: first});
  const laptop = answer({at: second});
  const merged = replayEvents("c1", [laptop, phone]);

  expect(merged?.state.reps).toBe(2);
  expect(merged?.log).toHaveLength(2);
});

it("breaks a tie between events at the same moment the same way every time", () => {
  const at = first.toISOString();
  const suspend: CardEvent = {cardId: "c1", kind: "suspend", at};
  const unsuspend: CardEvent = {cardId: "c1", kind: "unsuspend", at};

  expect(replayEvents("c1", [suspend, unsuspend])).toEqual(replayEvents("c1", [unsuspend, suspend]));
});

it("suspends and brings back a card without touching its schedule", () => {
  const answered = replayEvents("c1", [answer({at: first})])?.state;
  const suspended = replayEvents("c1", [
    answer({at: first}),
    {cardId: "c1", kind: "suspend", at: second.toISOString()},
  ])?.state;
  const back = replayEvents("c1", [
    answer({at: first}),
    {cardId: "c1", kind: "suspend", at: second.toISOString()},
    {cardId: "c1", kind: "unsuspend", at: third.toISOString()},
  ])?.state;

  expect(suspended).toEqual({...answered, suspended: true});
  expect(back).toEqual(answered);
});

it("buries a card until the moment given and marks one hard at the moment it happened", () => {
  const until = "2026-10-06T03:00:00.000Z";
  const buried = replayEvents("c1", [{cardId: "c1", kind: "bury", at: first.toISOString(), until}]);
  const hard = replayEvents("c1", [{cardId: "c1", kind: "hard", at: second.toISOString()}]);

  expect(buried?.state.buriedUntil).toBe(until);
  expect(hard?.state.markedHardAt).toBe(second.toISOString());
});
