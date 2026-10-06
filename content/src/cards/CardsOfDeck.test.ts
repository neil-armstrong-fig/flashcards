import {cardsOfDeck} from "@language-learning/content/cards/CardsOfDeck";
import type {Deck} from "@language-learning/content/types/Deck";

const deck: Deck = {
  id: "d",
  name: "d",
  language: "ko",
  notes: [
    {id: "a", language: "ko", word: "물", meaning: "water", romanisation: "mul"},
    {id: "b", language: "ko", word: "밥", meaning: "rice", romanisation: "bap"},
  ],
};

it("makes two cards from every note", () => {
  expect(cardsOfDeck(deck)).toHaveLength(4);
});

it("lists every word one way and then every word the other, so a word's two cards are apart", () => {
  expect(cardsOfDeck(deck).map(card => card.id)).toEqual([
    "a/to-english",
    "b/to-english",
    "a/from-english",
    "b/from-english",
  ]);
});
