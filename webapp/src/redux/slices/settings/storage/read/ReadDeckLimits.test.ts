import {readDeckLimits} from "@src/redux/slices/settings/storage/read/ReadDeckLimits";

it("reads the limits kept for each deck", () => {
  const limits = readDeckLimits({"ko-starter": {newCardsPerDay: 5, maxReviewsPerDay: 50}});

  expect(limits["ko-starter"]).toEqual({newCardsPerDay: 5, maxReviewsPerDay: 50, limitsUnlocked: false});
});

it("gives a deck with nothing kept the defaults, and a field that does not check out its default alone", () => {
  const limits = readDeckLimits({"ko-starter": {newCardsPerDay: "lots", maxReviewsPerDay: 50}});

  expect(limits["ko-starter"]).toEqual({newCardsPerDay: 20, maxReviewsPerDay: 50, limitsUnlocked: true});
  expect(limits["ja-hiragana"]).toEqual({newCardsPerDay: 20, maxReviewsPerDay: 200, limitsUnlocked: false});
});

it.each([
  ["nothing", undefined],
  ["a string", "x"],
  ["null", null],
  ["a list", []],
])("starts from the defaults for %s", (_name, stored) => {
  expect(readDeckLimits(stored)["ko-starter"]).toEqual({
    newCardsPerDay: 20,
    maxReviewsPerDay: 200,
    limitsUnlocked: false,
  });
});

it("keeps only decks the app ships", () => {
  expect(Object.keys(readDeckLimits({"nl-nothing": {newCardsPerDay: 1, maxReviewsPerDay: 1}}))).not.toContain(
    "nl-nothing",
  );
});

it("keeps a deck's limits unlocked, or locked, as they were kept", () => {
  const limits = readDeckLimits({
    "ko-starter": {newCardsPerDay: 5, maxReviewsPerDay: 7, limitsUnlocked: true},
    "ja-hiragana": {newCardsPerDay: 5, maxReviewsPerDay: 50, limitsUnlocked: false},
  });

  expect(limits["ko-starter"]?.limitsUnlocked).toBe(true);
  expect(limits["ja-hiragana"]?.limitsUnlocked).toBe(false);
});

it("unlocks limits kept before they could be locked when they are not ten reviews for each new card, so no choice changes", () => {
  const limits = readDeckLimits({
    "ko-starter": {newCardsPerDay: 5, maxReviewsPerDay: 7},
    "ja-hiragana": {newCardsPerDay: 5, maxReviewsPerDay: 50},
  });

  expect(limits["ko-starter"]).toEqual({newCardsPerDay: 5, maxReviewsPerDay: 7, limitsUnlocked: true});
  expect(limits["ja-hiragana"]).toEqual({newCardsPerDay: 5, maxReviewsPerDay: 50, limitsUnlocked: false});
});
