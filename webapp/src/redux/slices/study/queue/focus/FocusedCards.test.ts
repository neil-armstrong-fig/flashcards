import {focusedCards} from "@src/redux/slices/study/queue/focus/FocusedCards";
import {newCardState} from "@src/spaced-repetition/card/NewCardState";
import type {CardState} from "@src/spaced-repetition/card/types/CardState";
import type {ReviewLogEntry} from "@src/spaced-repetition/scheduling/types/ReviewLogEntry";
import type {SessionFocus} from "@src/redux/slices/study/types/SessionFocus";
import type {StudyCard} from "@src/spaced-repetition/card/types/StudyCard";

const now = new Date(2026, 9, 5, 10, 0);

function card(id: string, state: Partial<CardState> = {}): StudyCard {
  return {id, state: {...newCardState({due: now.toISOString()}), ...state}};
}

const brandNew = card("new");
const reviewed = card("reviewed", {phase: "review", lapses: 0});
const lapsed = card("lapsed", {phase: "review", lapses: 3});
const markedHard = card("hard", {phase: "review", markedHardAt: now.toISOString()});
const cards = [brandNew, reviewed, lapsed, markedHard];
const log: readonly ReviewLogEntry[] = [];

function focus(kind: SessionFocus["kind"]): SessionFocus {
  return {kind, strugglingAfter: 3};
}

it("keeps every card for a session on the whole deck", () => {
  expect(focusedCards(cards, log, focus("all"))).toEqual(cards);
});

it("keeps only the cards never seen for a session on new cards", () => {
  expect(focusedCards(cards, log, focus("new"))).toEqual([brandNew]);
});

it("keeps only the struggling cards for a session on those: forgotten enough times, or marked hard", () => {
  expect(focusedCards(cards, log, focus("struggling"))).toEqual([lapsed, markedHard]);
});

it("uses the threshold the session began with", () => {
  expect(focusedCards(cards, log, {kind: "struggling", strugglingAfter: 4})).toEqual([markedHard]);
});

it("counts a card as no longer struggling once its latest answers are good", () => {
  const goodAnswers: ReviewLogEntry[] = [0, 1, 2].map(index => ({
    cardId: "lapsed",
    rating: "good",
    phaseBefore: "review",
    reviewedAt: new Date(2026, 9, 1 + index).toISOString(),
    scheduledDays: 3,
    due: now.toISOString(),
  }));

  expect(focusedCards([lapsed], goodAnswers, focus("struggling"))).toEqual([]);
});
