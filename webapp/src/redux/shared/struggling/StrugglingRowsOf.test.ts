import {newCardState} from "@src/spaced-repetition/card/NewCardState";
import {strugglingRowsOf} from "@src/redux/shared/struggling/StrugglingRowsOf";
import type {CardState} from "@src/spaced-repetition/card/types/CardState";
import type {DeckCard} from "@flashcards/content/types/DeckCard";
import type {ReviewLogEntry} from "@src/spaced-repetition/scheduling/types/ReviewLogEntry";

const NOW = new Date(2026, 9, 5);

function card(id: string): DeckCard {
  return {id, front: `${id} front`, back: `${id} back`} as DeckCard;
}

function state(lapses: number, suspended = false): CardState {
  return {...newCardState({due: NOW.toISOString()}), lapses, suspended};
}

function answer(cardId: string, rating: ReviewLogEntry["rating"]): ReviewLogEntry {
  return {
    cardId,
    rating,
    phaseBefore: "review",
    reviewedAt: NOW.toISOString(),
    scheduledDays: 1,
    due: NOW.toISOString(),
  };
}

it("lists the cards forgotten at least as often as the threshold, in deck order, with their lapses", () => {
  const rows = strugglingRowsOf({
    cards: [card("a"), card("b"), card("c")],
    states: {a: state(3), b: state(1), c: state(4, true)},
    log: [],
    threshold: 3,
  });

  expect(rows).toEqual([
    {id: "a", front: "a front", back: "a back", lapses: 3, suspended: false},
    {id: "c", front: "c front", back: "c back", lapses: 4, suspended: true},
  ]);
});

it("leaves out a card whose latest answers are a clean run, using only its own answers", () => {
  const rows = strugglingRowsOf({
    cards: [card("a"), card("b")],
    states: {a: state(3), b: state(3)},
    log: [answer("a", "good"), answer("b", "again"), answer("a", "easy"), answer("b", "good"), answer("a", "good")],
    threshold: 3,
  });

  expect(rows.map(row => row.id)).toEqual(["b"]);
});

it("skips a card with no state", () => {
  expect(strugglingRowsOf({cards: [card("a")], states: {}, log: [], threshold: 1})).toEqual([]);
});
