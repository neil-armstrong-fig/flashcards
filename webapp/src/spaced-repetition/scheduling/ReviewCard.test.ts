import {newCardState} from "@src/spaced-repetition/card/NewCardState";
import {reviewCard} from "@src/spaced-repetition/scheduling/ReviewCard";
import type {StudyCard} from "@src/spaced-repetition/card/types/StudyCard";

const minutes = (count: number): number => count * 60 * 1000;
const now = new Date("2026-10-05T10:00:00Z");
const desiredRetention = 0.9;
const aNewCard: StudyCard = {id: "card-1", state: newCardState(now)};

it("starts a new card learning when it is rated good, and brings it back in ten minutes", () => {
  const {state} = reviewCard({card: aNewCard, rating: "good", now, desiredRetention});

  expect(state.phase).toBe("learning");
  expect(new Date(state.due).getTime() - now.getTime()).toBe(minutes(10));
});

it("brings a new card back in a minute when it is rated again", () => {
  const {state} = reviewCard({card: aNewCard, rating: "again", now, desiredRetention});

  expect(state.phase).toBe("learning");
  expect(new Date(state.due).getTime() - now.getTime()).toBe(minutes(1));
});

it("graduates a new card straight to review, days away, when it is rated easy", () => {
  const {state} = reviewCard({card: aNewCard, rating: "easy", now, desiredRetention});

  expect(state.phase).toBe("review");
  expect(state.scheduledDays).toBeGreaterThanOrEqual(1);
});

it("graduates a learning card to review when it is rated good a second time", () => {
  const first = reviewCard({card: aNewCard, rating: "good", now, desiredRetention});
  const later = new Date(first.state.due);

  const {state} = reviewCard({card: {id: "card-1", state: first.state}, rating: "good", now: later, desiredRetention});

  expect(state.phase).toBe("review");
});

it("sends a forgotten review card to relearning and counts the lapse", () => {
  const learned = reviewCard({card: aNewCard, rating: "easy", now, desiredRetention}).state;
  const dueAgain = new Date(learned.due);

  const {state} = reviewCard({card: {id: "card-1", state: learned}, rating: "again", now: dueAgain, desiredRetention});

  expect(state.phase).toBe("relearning");
  expect(state.lapses).toBe(1);
});

it("records what the answer was and what the card was before it", () => {
  const {log} = reviewCard({card: aNewCard, rating: "hard", now, desiredRetention});

  expect(log).toMatchObject({cardId: "card-1", rating: "hard", phaseBefore: "new", reviewedAt: now.toISOString()});
});

it("does not change the card it was given", () => {
  const before = JSON.stringify(aNewCard);

  reviewCard({card: aNewCard, rating: "easy", now, desiredRetention});

  expect(JSON.stringify(aNewCard)).toBe(before);
});

it("schedules a card further ahead when a lower retention is wanted", () => {
  const relaxed = reviewCard({card: aNewCard, rating: "easy", now, desiredRetention: 0.8}).state;
  const strict = reviewCard({card: aNewCard, rating: "easy", now, desiredRetention: 0.95}).state;

  expect(relaxed.scheduledDays).toBeGreaterThan(strict.scheduledDays);
});
