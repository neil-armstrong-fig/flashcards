import {newCardState} from "@src/spaced-repetition/card/NewCardState";
import {previewIntervals} from "@src/spaced-repetition/scheduling/PreviewIntervals";
import {reviewCard} from "@src/spaced-repetition/scheduling/ReviewCard";
import type {StudyCard} from "@src/spaced-repetition/card/types/StudyCard";

const minutes = (count: number): number => count * 60 * 1000;
const now = new Date("2026-10-05T10:00:00Z");
const desiredRetention = 0.9;
const aNewCard: StudyCard = {id: "card-1", state: newCardState({due: now.toISOString()})};

it("previews when a new card would come back for each rating, without changing the card", () => {
  const before = JSON.stringify(aNewCard);

  const preview = previewIntervals({card: aNewCard, now, desiredRetention});

  expect(preview.again).toBe(minutes(1));
  expect(preview.hard).toBe(minutes(6));
  expect(preview.good).toBe(minutes(10));
  expect(preview.easy).toBeGreaterThanOrEqual(minutes(24 * 60));
  expect(JSON.stringify(aNewCard)).toBe(before);
});

it("previews the same dates that answering would produce", () => {
  const learned = reviewCard({card: aNewCard, rating: "easy", now, desiredRetention}).state;
  const dueAgain = new Date(learned.due);
  const card: StudyCard = {id: "card-1", state: learned};

  const preview = previewIntervals({card, now: dueAgain, desiredRetention});

  expect(preview.good).toBe(
    new Date(reviewCard({card, rating: "good", now: dueAgain, desiredRetention}).state.due).getTime() -
      dueAgain.getTime(),
  );
});
