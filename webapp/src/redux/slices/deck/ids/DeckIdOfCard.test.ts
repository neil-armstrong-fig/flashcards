import {deckIdOfCard} from "@src/redux/slices/deck/ids/DeckIdOfCard";

it.each([
  ["ko-vocab-water/to-english", "ko-starter"],
  ["ko-vocab-water/from-english", "ko-starter"],
  ["ja-hiragana-ka/to-english", "ja-hiragana"],
  ["ja-katakana-ka/from-english", "ja-katakana"],
])("puts the shipped card %s in its deck", (cardId, deckId) => {
  expect(deckIdOfCard(cardId)).toBe(deckId);
});

it("puts a card the learner made in the Korean starter deck", () => {
  expect(deckIdOfCard("ko-custom-1b4e/to-english")).toBe("ko-starter");
});
