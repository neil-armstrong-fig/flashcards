import {buryCard} from "@src/spaced-repetition/card/setting-aside/BuryCard";
import {cardStatusOf} from "@src/spaced-repetition/card/CardStatusOf";
import {newCardState} from "@src/spaced-repetition/card/NewCardState";
import {suspendCard} from "@src/spaced-repetition/card/setting-aside/SuspendCard";
import type {CardState} from "@src/spaced-repetition/card/types/CardState";

// Local time, as the study day is: ten in the morning, so the day ends at four the next morning.
const now = new Date(2026, 9, 5, 10, 0);
const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

function reviewDueIn(milliseconds: number): CardState {
  return {...newCardState(now), phase: "review", reps: 3, due: new Date(now.getTime() + milliseconds).toISOString()};
}

it("is new for a card nobody has answered", () => {
  expect(cardStatusOf(newCardState(now), now)).toEqual({kind: "new"});
});

it.each(["learning", "relearning"] as const)("is learning for a card in %s", phase => {
  expect(cardStatusOf({...newCardState(now), phase}, now).kind).toBe("learning");
});

it("is due for a review that falls before the study day ends, even hours from now", () => {
  expect(cardStatusOf(reviewDueIn(2 * HOUR), now)).toEqual({kind: "due"});
});

it("is due for a review already overdue", () => {
  expect(cardStatusOf(reviewDueIn(-3 * DAY), now).kind).toBe("due");
});

it("is scheduled, with how long until it is due, for a review on a later day", () => {
  expect(cardStatusOf(reviewDueIn(3 * DAY), now)).toEqual({kind: "scheduled", dueInMs: 3 * DAY});
});

it("is suspended for a suspended card, whatever its schedule says", () => {
  expect(cardStatusOf(suspendCard(reviewDueIn(-DAY)), now).kind).toBe("suspended");
});

it("is buried for a card buried until a later moment", () => {
  const buried = buryCard(reviewDueIn(-DAY), new Date(now.getTime() + 5 * HOUR));

  expect(cardStatusOf(buried, now).kind).toBe("buried");
});

it("is no longer buried once that moment has passed", () => {
  const buried = buryCard(reviewDueIn(-DAY), new Date(now.getTime() - HOUR));

  expect(cardStatusOf(buried, now).kind).toBe("due");
});

it("says suspended before buried when a card is both", () => {
  const both = suspendCard(buryCard(newCardState(now), new Date(now.getTime() + 5 * HOUR)));

  expect(cardStatusOf(both, now).kind).toBe("suspended");
});
