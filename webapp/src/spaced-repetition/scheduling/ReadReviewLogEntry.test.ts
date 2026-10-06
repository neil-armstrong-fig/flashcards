import {readReviewLogEntry} from "@src/spaced-repetition/scheduling/ReadReviewLogEntry";
import type {ReviewLogEntry} from "@src/spaced-repetition/scheduling/types/ReviewLogEntry";

const valid: ReviewLogEntry = {
  cardId: "card-1",
  rating: "good",
  phaseBefore: "new",
  reviewedAt: "2026-10-05T10:00:00.000Z",
  scheduledDays: 0,
  due: "2026-10-05T10:10:00.000Z",
};

it("reads back an entry that was stored", () => {
  expect(readReviewLogEntry(JSON.parse(JSON.stringify(valid)))).toEqual(valid);
});

it.each([
  ["nothing", null],
  ["an unknown rating", {...valid, rating: "perfect"}],
  ["an unknown phase", {...valid, phaseBefore: "buried"}],
  ["a missing card id", {...valid, cardId: undefined}],
  ["a date that is not one", {...valid, reviewedAt: "later"}],
])("refuses %s", (_name, stored) => {
  expect(readReviewLogEntry(stored)).toBeUndefined();
});
