import {newCardsIntroduced} from "@src/spaced-repetition/queue/done-today/NewCardsIntroduced";
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

it("counts the cards answered for the first time today", () => {
  expect(newCardsIntroduced([entry({cardId: "a"}), entry({cardId: "b"})], now)).toBe(2);
});

it("does not count an answer to a card that was already being learned", () => {
  expect(newCardsIntroduced([entry({phaseBefore: "learning"})], now)).toBe(0);
});

it("does not count cards introduced on an earlier study day", () => {
  const yesterday = new Date(2026, 9, 4, 10, 0).toISOString();

  expect(newCardsIntroduced([entry({reviewedAt: yesterday})], now)).toBe(0);
});
