import {isAvailable} from "@src/spaced-repetition/queue/timing/IsAvailable";
import {newCardState} from "@src/spaced-repetition/card/NewCardState";
import type {CardState} from "@src/spaced-repetition/card/types/CardState";

const now = new Date("2026-10-05T10:00:00Z");

function cardWith(overrides: Partial<CardState>): {id: string; state: CardState} {
  return {id: "c", state: {...newCardState({due: now.toISOString()}), ...overrides}};
}

it("shows an ordinary card", () => {
  expect(isAvailable(cardWith({}), now)).toBe(true);
});

it("never shows a suspended card", () => {
  expect(isAvailable(cardWith({suspended: true}), new Date("2030-01-01T00:00:00Z"))).toBe(false);
});

it("hides a buried card until the moment it was buried until", () => {
  const card = cardWith({buriedUntil: "2026-10-06T03:00:00.000Z"});

  expect(isAvailable(card, now)).toBe(false);
  expect(isAvailable(card, new Date("2026-10-06T03:00:00.000Z"))).toBe(true);
});
