import {newCardState} from "@src/spaced-repetition/card/NewCardState";
import {nextCard} from "@src/spaced-repetition/queue/NextCard";
import type {CardState} from "@src/spaced-repetition/card/types/CardState";
import type {ReviewLogEntry} from "@src/spaced-repetition/scheduling/types/ReviewLogEntry";
import type {QueueSettings} from "@src/spaced-repetition/queue/types/QueueSettings";
import type {StudyCard} from "@src/spaced-repetition/card/types/StudyCard";

const now = new Date(2026, 9, 5, 10, 0);
const settings: QueueSettings = {newCardsPerDay: 20, maxReviewsPerDay: 200, learnAheadMinutes: 20};

function card(id: string, state: Partial<CardState> = {}): StudyCard {
  return {id, state: {...newCardState({due: now.toISOString()}), ...state}};
}

function minutesFromNow(minutes: number): string {
  return new Date(now.getTime() + minutes * 60 * 1000).toISOString();
}

it("shows nothing when there is nothing to do", () => {
  expect(nextCard([], [], now, settings)).toBeUndefined();
});

it("shows a learning card whose wait is over before a new card", () => {
  const cards = [card("new"), card("learning", {phase: "learning", due: minutesFromNow(-1)})];

  expect(nextCard(cards, [], now, settings)?.id).toBe("learning");
});

it("shows a new card ahead of a learning card that is still waiting", () => {
  const cards = [card("learning", {phase: "learning", due: minutesFromNow(10)}), card("new")];

  expect(nextCard(cards, [], now, settings)?.id).toBe("new");
});

it("shows a learning card early when only learning cards are left and one is within the learn-ahead time", () => {
  const cards = [card("soon", {phase: "learning", due: minutesFromNow(10)})];

  expect(nextCard(cards, [], now, settings)?.id).toBe("soon");
});

it("leaves a learning card alone when it is further away than the learn-ahead time", () => {
  const cards = [card("later", {phase: "learning", due: minutesFromNow(45)})];

  expect(nextCard(cards, [], now, settings)).toBeUndefined();
});

it("shows the review that has waited longest first", () => {
  const cards = [
    card("recent", {phase: "review", due: minutesFromNow(-60)}),
    card("oldest", {phase: "review", due: minutesFromNow(-600)}),
  ];

  expect(nextCard(cards, [], now, settings)?.id).toBe("oldest");
});

function answered(cardId: string): ReviewLogEntry {
  return {
    cardId,
    rating: "good",
    phaseBefore: "new",
    reviewedAt: now.toISOString(),
    scheduledDays: 0,
    due: minutesFromNow(10),
  };
}

it("holds back the other card of a word answered today while something else is left", () => {
  const cards = [card("water/b"), card("rice/a")];

  expect(nextCard(cards, [answered("water/a")], now, settings)?.id).toBe("rice/a");
});

it("shows the held-back card when nothing else is left, as the last card standing", () => {
  const cards = [card("water/b")];

  expect(nextCard(cards, [answered("water/a")], now, settings)?.id).toBe("water/b");
});

it("prefers a learning card that is only minutes away to a held-back new sibling", () => {
  const cards = [card("water/b"), card("water/a", {phase: "learning", due: minutesFromNow(10)})];

  expect(nextCard(cards, [answered("water/a")], now, settings)?.id).toBe("water/a");
});
