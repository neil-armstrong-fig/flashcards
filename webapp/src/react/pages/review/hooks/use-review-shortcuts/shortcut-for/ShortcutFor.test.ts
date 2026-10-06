import {shortcutFor} from "@src/react/pages/review/hooks/use-review-shortcuts/shortcut-for/ShortcutFor";
import type {ReviewScreenState} from "@src/react/pages/review/hooks/use-review-shortcuts/types/ReviewScreenState";

const questionShown: ReviewScreenState = {hasCard: true, answerShown: false, lookingAhead: false};
const answerShown: ReviewScreenState = {hasCard: true, answerShown: true, lookingAhead: false};

it("shows the answer on space", () => {
  expect(shortcutFor(" ", questionShown)).toEqual({kind: "showAnswer"});
});

it("rates good on space once the answer is shown", () => {
  expect(shortcutFor(" ", answerShown)).toEqual({kind: "rate", rating: "good"});
});

it.each([
  ["1", "again"],
  ["2", "hard"],
  ["3", "good"],
  ["4", "easy"],
])("rates on %s once the answer is shown", (key, rating) => {
  expect(shortcutFor(key, answerShown)).toEqual({kind: "rate", rating});
});

it("ignores a rating key before the answer is shown", () => {
  expect(shortcutFor("1", questionShown)).toBeUndefined();
});

it("does nothing once the session is complete", () => {
  const complete: ReviewScreenState = {hasCard: false, answerShown: false, lookingAhead: false};

  expect(shortcutFor(" ", complete)).toBeUndefined();
});

it("buries on - and suspends on @, before or after the answer is shown", () => {
  expect(shortcutFor("-", questionShown)).toEqual({kind: "setAside", how: "bury"});
  expect(shortcutFor("@", answerShown)).toEqual({kind: "setAside", how: "suspend"});
});

it("does not set a card aside when there is no card", () => {
  expect(shortcutFor("-", {hasCard: false, answerShown: false, lookingAhead: false})).toBeUndefined();
});

it("ignores a key that means nothing", () => {
  expect(shortcutFor("q", answerShown)).toBeUndefined();
});

it("moves on rather than rating when looking ahead, because a look ahead has no answers to give", () => {
  const ahead: ReviewScreenState = {hasCard: true, answerShown: true, lookingAhead: true};

  expect(shortcutFor(" ", ahead)).toEqual({kind: "next"});
  expect(shortcutFor("Enter", ahead)).toEqual({kind: "next"});
  expect(shortcutFor("4", ahead)).toBeUndefined();
});

it("still shows the answer on space when looking ahead, and sets nothing aside", () => {
  const ahead: ReviewScreenState = {hasCard: true, answerShown: false, lookingAhead: true};

  expect(shortcutFor(" ", ahead)).toEqual({kind: "showAnswer"});
  expect(shortcutFor("-", ahead)).toBeUndefined();
  expect(shortcutFor("@", ahead)).toBeUndefined();
});
