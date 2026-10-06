import {reviewsDone} from "@src/spaced-repetition/queue/done-today/ReviewsDone";
import type {ReviewLogEntry} from "@src/spaced-repetition/scheduling/types/ReviewLogEntry";

const now = new Date(2026, 9, 5, 10, 0);

function entry(overrides: Partial<ReviewLogEntry>): ReviewLogEntry {
  return {
    cardId: "card",
    rating: "good",
    phaseBefore: "review",
    reviewedAt: now.toISOString(),
    scheduledDays: 5,
    due: now.toISOString(),
    ...overrides,
  };
}

it("counts the answers today to cards that were already in review", () => {
  expect(reviewsDone([entry({}), entry({cardId: "b"})], now)).toBe(2);
});

it("does not count new or learning cards, which have no daily limit of their own to spend here", () => {
  expect(
    reviewsDone(
      [entry({phaseBefore: "new"}), entry({phaseBefore: "learning"}), entry({phaseBefore: "relearning"})],
      now,
    ),
  ).toBe(0);
});

it("does not count answers from an earlier study day", () => {
  expect(reviewsDone([entry({reviewedAt: new Date(2026, 9, 4, 10, 0).toISOString()})], now)).toBe(0);
});
