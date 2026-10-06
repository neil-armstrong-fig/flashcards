import {koreanWordFrom} from "@language-learning/shared/language/KoreanText";

it("accepts a Korean word, trimmed", () => {
  expect(koreanWordFrom(" 불 ")).toBe("불");
});

it("accepts more than one word", () => {
  expect(koreanWordFrom("한국 사람")).toBe("한국 사람");
});

it.each([
  ["nothing", ""],
  ["spaces", "   "],
  ["English", "water"],
  ["mixed", "불a"],
  ["markup", "불<b>"],
  ["too long", "가".repeat(13)],
])("refuses %s", (_name, text) => {
  expect(koreanWordFrom(text)).toBeUndefined();
});
