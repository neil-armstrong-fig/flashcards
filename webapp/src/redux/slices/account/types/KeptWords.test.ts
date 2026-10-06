import {isKeptWords} from "@src/redux/slices/account/types/KeptWords";

it("accepts words by note", () => {
  expect(isKeptWords({"ko-vocab-water": ["불", "볼"], "ko-vocab-rice": []})).toBe(true);
});

it.each([
  ["a list", ["불"]],
  ["a string", "불"],
  ["null", null],
  ["a note whose words are not a list", {a: "불"}],
  ["a word that is not a string", {a: [1]}],
])("refuses %s", (_name, value) => {
  expect(isKeptWords(value)).toBe(false);
});
