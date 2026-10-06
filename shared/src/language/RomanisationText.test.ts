import {romanisationFrom} from "@flashcards/shared/language/RomanisationText";

it("accepts a romanisation, trimmed", () => {
  expect(romanisationFrom(" kokkiri ")).toBe("kokkiri");
});

it("accepts spaces and hyphens", () => {
  expect(romanisationFrom("han-guk saram")).toBe("han-guk saram");
});

it.each([
  ["nothing", ""],
  ["spaces", "   "],
  ["Korean", "코끼리"],
  ["a breve", "ŏ"],
  ["an apostrophe", "k'o"],
  ["markup", "ko<b>"],
  ["too long", "a".repeat(41)],
])("refuses %s", (_name, text) => {
  expect(romanisationFrom(text)).toBeUndefined();
});
