import {buryCard} from "@src/spaced-repetition/card/setting-aside/BuryCard";
import {newCardState} from "@src/spaced-repetition/card/NewCardState";
import {suspendCard} from "@src/spaced-repetition/card/setting-aside/SuspendCard";
import {unsuspendCard} from "@src/spaced-repetition/card/setting-aside/UnsuspendCard";

const now = new Date("2026-10-05T10:00:00Z");

it("suspends a card without changing anything else about it", () => {
  const state = newCardState(now);

  expect(suspendCard(state)).toEqual({...state, suspended: true});
});

it("brings a suspended card back with its schedule untouched", () => {
  const state = newCardState(now);

  expect(unsuspendCard(suspendCard(state))).toEqual(state);
});

it("buries a card until the moment given", () => {
  const until = new Date("2026-10-06T03:00:00Z");

  expect(buryCard(newCardState(now), until).buriedUntil).toBe(until.toISOString());
});
