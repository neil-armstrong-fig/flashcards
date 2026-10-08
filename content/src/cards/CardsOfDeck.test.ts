import {cardsOfDeck} from "@flashcards/content/cards/CardsOfDeck";
import type {Deck} from "@flashcards/content/types/Deck";

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

it("makes one card, the reading one, from a pronunciation", () => {
  const pronounced: Deck = {
    ...deck,
    notes: [{id: "p", kind: "pronunciation", language: "ko", word: "좋다", meaning: "조타", romanisation: "jota"}],
  };

  expect(cardsOfDeck(pronounced).map(card => card.id)).toEqual(["p/to-english"]);
});
