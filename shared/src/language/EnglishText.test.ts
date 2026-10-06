import {englishMeaningFrom} from "@flashcards/shared/language/EnglishText";

it("accepts a meaning, trimmed", () => {
  expect(englishMeaningFrom(" elephant ")).toBe("elephant");
});

it("accepts spaces, commas, apostrophes and hyphens", () => {
  expect(englishMeaningFrom("to go, don't stop-start")).toBe("to go, don't stop-start");
});

it.each([
  ["nothing", ""],
  ["spaces", "   "],
  ["Korean", "코끼리"],
  ["markup", "elephant<b>"],
  ["digits", "elephant2"],
  ["too long", "a".repeat(41)],
])("refuses %s", (_name, text) => {
  expect(englishMeaningFrom(text)).toBeUndefined();
});

it("accepts the longest meaning", () => {
  expect(englishMeaningFrom("a".repeat(40))).toBe("a".repeat(40));
});
