import {browseRowsOf} from "@src/redux/slices/browse/rows/BrowseRowsOf";
import {cardsOfDeck} from "@flashcards/content/cards/CardsOfDeck";
import {newCardState} from "@src/spaced-repetition/card/NewCardState";
import {suspendCard} from "@src/spaced-repetition/card/setting-aside/SuspendCard";
import type {CardState} from "@src/spaced-repetition/card/types/CardState";
import type {Deck} from "@flashcards/content/types/Deck";

const NOW = new Date(2026, 9, 5, 10, 0);

const DECK: Deck = {
  id: "ko-test",
  name: "Test",
  language: "ko",
  notes: [
    {id: "ko-vocab-water", language: "ko", word: "물", meaning: "water", romanisation: "mul"},
    {id: "ko-vocab-school", language: "ko", word: "학교", meaning: "school", romanisation: "hakgyo"},
  ],
};

const CARDS = cardsOfDeck(DECK);

function everyCardNew(): Record<string, CardState> {
  return Object.fromEntries(CARDS.map(card => [card.id, newCardState(NOW)]));
}

it("lists every card in deck order, both directions of each word", () => {
  const rows = browseRowsOf(CARDS, everyCardNew(), NOW, "");

  expect(rows.map(row => row.front)).toEqual(["물", "학교", "water", "school"]);
});

it("says the Korean word of a card whichever side it is on", () => {
  const rows = browseRowsOf(CARDS, everyCardNew(), NOW, "");

  expect(rows.find(row => row.front === "water")?.korean).toBe("물");
  expect(rows.find(row => row.front === "물")?.korean).toBe("물");
});

it.each([
  ["a meaning", "WATER", ["물", "water"]],
  ["the Korean", "학", ["학교", "school"]],
  ["how it is said in Latin letters", "hakgyo", ["학교", "school"]],
  ["with spaces round it", "  mul ", ["물", "water"]],
])("narrows the list by %s", (_name, query, fronts) => {
  expect(
    browseRowsOf(CARDS, everyCardNew(), NOW, query)
      .map(row => row.front)
      .sort(),
  ).toEqual([...fronts].sort());
});

it("finds nothing for a search that matches nothing", () => {
  expect(browseRowsOf(CARDS, everyCardNew(), NOW, "zzz")).toEqual([]);
});

it("carries where each card is in its life", () => {
  const states = everyCardNew();
  states["ko-vocab-water/to-english"] = suspendCard(newCardState(NOW));

  const rows = browseRowsOf(CARDS, states, NOW, "");

  expect(rows.find(row => row.id === "ko-vocab-water/to-english")?.status.kind).toBe("suspended");
  expect(rows.find(row => row.id === "ko-vocab-school/to-english")?.status.kind).toBe("new");
});

it("leaves out a card nothing is known about", () => {
  expect(browseRowsOf(CARDS, {}, NOW, "")).toEqual([]);
});
