import {keepStoredSimilar} from "@src/storage/local-storage/similar/KeepStoredSimilar";
import {loadSimilar} from "@src/redux/slices/similar/persistence/LoadSimilar";

function holding(stored: unknown): void {
  keepStoredSimilar(stored);
}

it("loads the words that were kept", () => {
  holding({words: {"ko-vocab-water": ["불", "볼"]}});
  expect(loadSimilar().words).toEqual({
    "ko-vocab-water": ["불", "볼"],
  });
});

it("starts empty when nothing was kept", () => {
  expect(loadSimilar().words).toEqual({});
});

it("drops what is not a Korean word and keeps the rest", () => {
  holding({words: {"ko-vocab-water": ["불", 7, "water", "볼"]}});
  expect(loadSimilar().words).toEqual({
    "ko-vocab-water": ["불", "볼"],
  });
});

it.each([
  ["not an object", 7],
  ["no words", {}],
  ["words that are not an object", {words: "불"}],
  ["null", null],
])("does not trust %s", (_name, stored) => {
  holding(stored);
  expect(loadSimilar().words).toEqual({});
});

it("ignores a note whose words are not a list", () => {
  holding({words: {"ko-vocab-water": "불"}});
  expect(loadSimilar().words).toEqual({});
});
