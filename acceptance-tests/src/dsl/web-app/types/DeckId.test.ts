import {isDeckId} from "@src/dsl/web-app/types/DeckId";

it("knows the decks the app ships", () => {
  expect(isDeckId("ja-hiragana")).toBe(true);
});

it("does not take anything else for a deck", () => {
  expect(isDeckId("all")).toBe(false);
  expect(isDeckId("")).toBe(false);
});
