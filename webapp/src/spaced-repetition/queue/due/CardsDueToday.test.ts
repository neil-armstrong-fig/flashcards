import {cardsDueToday} from "@src/spaced-repetition/queue/due/CardsDueToday";
import {newCardState} from "@src/spaced-repetition/card/NewCardState";
import type {CardState} from "@src/spaced-repetition/card/types/CardState";
import type {QueueSettings} from "@src/spaced-repetition/queue/types/QueueSettings";
import type {ReviewLogEntry} from "@src/spaced-repetition/scheduling/types/ReviewLogEntry";
import type {StudyCard} from "@src/spaced-repetition/card/types/StudyCard";

const now = new Date(2026, 9, 5, 10, 0);
const settings: QueueSettings = {newCardsPerDay: 20, maxReviewsPerDay: 200, learnAheadMinutes: 20};

function card(id: string, state: Partial<CardState> = {}): StudyCard {
  return {id, state: {...newCardState({due: now.toISOString()}), ...state}};
}

function at(days: number, hour = 10): string {
  return new Date(2026, 9, 5 + days, hour, 0).toISOString();
}

const ids = (cards: StudyCard[]): string[] => cards.map(entry => entry.id);

it("lists new cards in deck order", () => {
  expect(ids(cardsDueToday([card("a"), card("b")], [], now, settings))).toEqual(["a", "b"]);
});

it("stops listing new cards once the day's allowance is used", () => {
  const cards = [card("a"), card("b"), card("c")];

  expect(ids(cardsDueToday(cards, [], now, {...settings, newCardsPerDay: 2}))).toEqual(["a", "b"]);
});

it("takes the cards already introduced today out of the allowance", () => {
  const introduced: ReviewLogEntry = {
    cardId: "x",
    rating: "good",
    phaseBefore: "new",
    reviewedAt: now.toISOString(),
    scheduledDays: 0,
    due: now.toISOString(),
  };

  expect(ids(cardsDueToday([card("a"), card("b")], [introduced], now, {...settings, newCardsPerDay: 1}))).toEqual([]);
});

it("lists a review card due later today but not one due tomorrow", () => {
  const cards = [card("today", {phase: "review", due: at(0, 23)}), card("tomorrow", {phase: "review", due: at(1, 11)})];

  expect(ids(cardsDueToday(cards, [], now, settings))).toEqual(["today"]);
});

it("lists cards being learned, then reviews, then new cards", () => {
  const cards = [
    card("new"),
    card("review", {phase: "review", due: at(0, 9)}),
    card("learning", {phase: "learning", due: at(0, 10)}),
  ];

  expect(ids(cardsDueToday(cards, [], now, settings))).toEqual(["learning", "review", "new"]);
});

it("leaves out a suspended card and a card buried for the rest of today", () => {
  const cards = [
    card("suspended", {suspended: true}),
    card("buried", {buriedUntil: new Date(2026, 9, 6, 4, 0).toISOString()}),
    card("ordinary"),
  ];

  expect(ids(cardsDueToday(cards, [], now, settings))).toEqual(["ordinary"]);
});

it("does not let a hidden card use up the day's new-card allowance", () => {
  const cards = [card("suspended", {suspended: true}), card("a"), card("b")];

  expect(ids(cardsDueToday(cards, [], now, {...settings, newCardsPerDay: 2}))).toEqual(["a", "b"]);
});

it("stops listing reviews once the day's review limit is used, soonest due first", () => {
  const cards = [
    card("later", {phase: "review", due: at(0, 22)}),
    card("sooner", {phase: "review", due: at(0, 9)}),
    card("latest", {phase: "review", due: at(0, 23)}),
  ];

  expect(ids(cardsDueToday(cards, [], now, {...settings, maxReviewsPerDay: 2}))).toEqual(["sooner", "later"]);
});

it("takes the reviews already done today out of the review limit, but never limits cards being learned", () => {
  const done: ReviewLogEntry = {
    cardId: "x",
    rating: "good",
    phaseBefore: "review",
    reviewedAt: now.toISOString(),
    scheduledDays: 5,
    due: now.toISOString(),
  };
  const cards = [
    card("review", {phase: "review", due: at(0, 9)}),
    card("learning", {phase: "learning", due: at(0, 9)}),
  ];

  expect(ids(cardsDueToday(cards, [done], now, {...settings, maxReviewsPerDay: 1}))).toEqual(["learning"]);
});
