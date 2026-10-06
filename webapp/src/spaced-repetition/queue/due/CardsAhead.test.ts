import {cardsAhead} from "@src/spaced-repetition/queue/due/CardsAhead";
import {newCardState} from "@src/spaced-repetition/card/NewCardState";
import type {CardState} from "@src/spaced-repetition/card/types/CardState";
import type {StudyCard} from "@src/spaced-repetition/card/types/StudyCard";

const now = new Date(2026, 9, 5, 10, 0);

function card(id: string, state: Partial<CardState> = {}): StudyCard {
  return {id, state: {...newCardState(now), ...state}};
}

function inDays(days: number): string {
  return new Date(2026, 9, 5 + days, 10, 0).toISOString();
}

const ids = (cards: readonly StudyCard[]): string[] => cards.map(entry => entry.id);

it("lists the reviews that fall due on a later day, soonest first", () => {
  const cards = [card("later", {phase: "review", due: inDays(9)}), card("soon", {phase: "review", due: inDays(2)})];

  expect(ids(cardsAhead(cards, now, 10))).toEqual(["soon", "later"]);
});

it("leaves out what is due today, new cards, and cards still being learned", () => {
  const cards = [
    card("today", {phase: "review", due: inDays(0)}),
    card("fresh"),
    card("learning", {phase: "learning", due: inDays(3)}),
  ];

  expect(cardsAhead(cards, now, 10)).toEqual([]);
});

it("leaves out suspended and buried cards, as they are never shown", () => {
  const cards = [
    card("suspended", {phase: "review", due: inDays(4), suspended: true}),
    card("buried", {phase: "review", due: inDays(4), buriedUntil: inDays(1)}),
  ];

  expect(cardsAhead(cards, now, 10)).toEqual([]);
});

it("stops at the number asked for", () => {
  const cards = [1, 2, 3].map(days => card(`in-${days}`, {phase: "review", due: inDays(days)}));

  expect(ids(cardsAhead(cards, now, 2))).toEqual(["in-1", "in-2"]);
});
