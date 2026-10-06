import {cardsOfNote} from "@flashcards/content/cards/CardsOfNote";

it("makes a card for each direction, with ids from the note's", () => {
  const cards = cardsOfNote({
    id: "ko-custom-1",
    language: "ko",
    word: "코끼리",
    meaning: "elephant",
    romanisation: "kokkiri",
  });

  expect(cards.map(card => card.id)).toEqual(["ko-custom-1/to-english", "ko-custom-1/from-english"]);
  expect(cards.map(card => card.front)).toEqual(["코끼리", "elephant"]);
});
