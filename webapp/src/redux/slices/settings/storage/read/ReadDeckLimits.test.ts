import {readDeckLimits} from "@src/redux/slices/settings/storage/read/ReadDeckLimits";

it("reads the limits kept for each deck", () => {
  const limits = readDeckLimits({"ko-starter": {newCardsPerDay: 5, maxReviewsPerDay: 50}});

  expect(limits["ko-starter"]).toEqual({newCardsPerDay: 5, maxReviewsPerDay: 50});
});

it("gives a deck with nothing kept the defaults, and a field that does not check out its default alone", () => {
  const limits = readDeckLimits({"ko-starter": {newCardsPerDay: "lots", maxReviewsPerDay: 50}});

  expect(limits["ko-starter"]).toEqual({newCardsPerDay: 20, maxReviewsPerDay: 50});
  expect(limits["ja-hiragana"]).toEqual({newCardsPerDay: 20, maxReviewsPerDay: 200});
});

it.each([
  ["nothing", undefined],
  ["a string", "x"],
  ["null", null],
  ["a list", []],
])("starts from the defaults for %s", (_name, stored) => {
  expect(readDeckLimits(stored)["ko-starter"]).toEqual({newCardsPerDay: 20, maxReviewsPerDay: 200});
});

it("keeps only decks the app ships", () => {
  expect(Object.keys(readDeckLimits({"nl-nothing": {newCardsPerDay: 1, maxReviewsPerDay: 1}}))).not.toContain(
    "nl-nothing",
  );
});
