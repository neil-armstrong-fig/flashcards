import type {CardState} from "@src/spaced-repetition/card/types/CardState";
import {isStruggling} from "@src/spaced-repetition/card/IsStruggling";
import {newCardState} from "@src/spaced-repetition/card/NewCardState";
import type {Rating} from "@flashcards/shared/study/Rating";
import type {ReviewLogEntry} from "@src/spaced-repetition/scheduling/types/ReviewLogEntry";

function answers(...ratings: Rating[]): ReviewLogEntry[] {
  return ratings.map((rating, index) => ({
    cardId: "card",
    rating,
    phaseBefore: "review",
    reviewedAt: new Date(2026, 9, 1 + index).toISOString(),
    scheduledDays: 1,
    due: new Date(2026, 9, 2 + index).toISOString(),
  }));
}

const forgotten = (lapses: number): CardState => ({...newCardState({due: new Date(2026, 9, 1).toISOString()}), lapses});

it("is not struggling below the threshold", () => {
  expect(isStruggling(forgotten(7), answers("again"), 8)).toBe(false);
});

it("is struggling once forgotten as many times as the threshold", () => {
  expect(isStruggling(forgotten(8), answers("again"), 8)).toBe(true);
});

it("is struggling after being forgotten and then answered well twice", () => {
  expect(isStruggling(forgotten(8), answers("again", "good", "easy"), 8)).toBe(true);
});

it("is cleared by three good or easy answers in a row", () => {
  expect(isStruggling(forgotten(8), answers("again", "good", "easy", "good"), 8)).toBe(false);
});

it("is not cleared by a hard answer among them", () => {
  expect(isStruggling(forgotten(8), answers("good", "hard", "good"), 8)).toBe(true);
});

it("is struggling again when forgotten again after being cleared", () => {
  expect(isStruggling(forgotten(9), answers("again", "good", "good", "good", "again"), 8)).toBe(true);
});

describe("a card the learner marked as hard", () => {
  const markedAt = new Date(2026, 9, 3, 12, 0).toISOString();
  const hard = (): CardState => ({...forgotten(0), markedHardAt: markedAt});

  it("is struggling at once, however few times it has been forgotten", () => {
    expect(isStruggling(hard(), [], 8)).toBe(true);
  });

  it("is not cleared by good answers it had before it was marked", () => {
    expect(isStruggling(hard(), answers("good", "good", "good"), 8)).toBe(true);
  });

  it("is cleared by three good or easy answers in a row since it was marked", () => {
    expect(isStruggling(hard(), answers("again", "again", "again", "good", "easy", "good"), 8)).toBe(false);
  });

  it("is still struggling after two, or a hard answer among them", () => {
    expect(isStruggling(hard(), answers("again", "again", "again", "good", "easy"), 8)).toBe(true);
    expect(isStruggling(hard(), answers("again", "again", "again", "good", "hard", "good"), 8)).toBe(true);
  });
});
