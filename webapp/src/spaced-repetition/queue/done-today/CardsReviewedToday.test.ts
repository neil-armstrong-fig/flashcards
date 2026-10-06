import {cardsReviewedToday} from "@src/spaced-repetition/queue/done-today/CardsReviewedToday";
import type {ReviewLogEntry} from "@src/spaced-repetition/scheduling/types/ReviewLogEntry";

const now = new Date(2026, 9, 5, 10, 0);

function entry(overrides: Partial<ReviewLogEntry>): ReviewLogEntry {
  return {
    cardId: "card",
    rating: "good",
    phaseBefore: "new",
    reviewedAt: now.toISOString(),
    scheduledDays: 0,
    due: now.toISOString(),
    ...overrides,
  };
}

it("counts the different cards answered today, new or not", () => {
  expect(cardsReviewedToday([entry({cardId: "a"}), entry({cardId: "b", phaseBefore: "review"})], now)).toBe(2);
});

it("counts a card once however many times it was answered", () => {
  expect(cardsReviewedToday([entry({rating: "again"}), entry({rating: "good", phaseBefore: "learning"})], now)).toBe(1);
});

it("does not count answers from an earlier study day", () => {
  const yesterday = new Date(2026, 9, 4, 10, 0).toISOString();

  expect(cardsReviewedToday([entry({reviewedAt: yesterday})], now)).toBe(0);
});

it("counts an answer given after midnight as part of the day before, until the day rolls over", () => {
  const afterMidnight = new Date(2026, 9, 5, 1, 0);
  const lateEvening = new Date(2026, 9, 4, 23, 0).toISOString();

  expect(cardsReviewedToday([entry({reviewedAt: lateEvening})], afterMidnight)).toBe(1);
});
