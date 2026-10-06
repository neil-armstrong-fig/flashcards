import type {Rating} from "@flashcards/shared/study/Rating";
import {shouldFadeAids} from "@src/spaced-repetition/card/fading/ShouldFadeAids";
import type {ReviewLogEntry} from "@src/spaced-repetition/scheduling/types/ReviewLogEntry";

function answer(rating: Rating, day: number): ReviewLogEntry {
  return {
    cardId: "a",
    rating,
    phaseBefore: "review",
    reviewedAt: `2026-10-${String(day).padStart(2, "0")}T10:00:00.000Z`,
    scheduledDays: 1,
    due: "2026-11-01T10:00:00.000Z",
  };
}

const ADDED = "2026-10-05T10:00:00.000Z";

it("offers once the latest three answers since the aid was added are good or easy", () => {
  expect(shouldFadeAids(ADDED, [answer("easy", 5), answer("good", 6), answer("good", 7)])).toBe(true);
});

it("waits while there are fewer than three answers since the aid was added", () => {
  expect(shouldFadeAids(ADDED, [answer("good", 6), answer("good", 7)])).toBe(false);
});

it("does not count answers given before the aid was added", () => {
  expect(shouldFadeAids(ADDED, [answer("good", 1), answer("good", 2), answer("good", 3), answer("good", 6)])).toBe(
    false,
  );
});

it("counts an answer given at the very moment the aid was added", () => {
  expect(shouldFadeAids(ADDED, [answer("good", 5), answer("good", 6), answer("good", 7)])).toBe(true);
});

it.each<Rating>(["again", "hard"])("starts over when the card was answered %s among the latest three", rating => {
  expect(shouldFadeAids(ADDED, [answer("good", 5), answer(rating, 6), answer("good", 7)])).toBe(false);
});

it("looks only at the latest three, so an old stumble does not count", () => {
  const log = [answer("again", 5), answer("good", 6), answer("good", 7), answer("easy", 8)];

  expect(shouldFadeAids(ADDED, log)).toBe(true);
});

it("treats a stored empty timestamp as always before, so every answer counts", () => {
  expect(shouldFadeAids("", [answer("good", 1), answer("good", 2), answer("good", 3)])).toBe(true);
});
