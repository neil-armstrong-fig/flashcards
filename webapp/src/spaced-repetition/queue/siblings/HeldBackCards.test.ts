import {heldBackCards} from "@src/spaced-repetition/queue/siblings/HeldBackCards";
import {newCardState} from "@src/spaced-repetition/card/NewCardState";
import type {ReviewLogEntry} from "@src/spaced-repetition/scheduling/types/ReviewLogEntry";
import type {StudyCard} from "@src/spaced-repetition/card/types/StudyCard";

const now = new Date(2026, 9, 5, 10, 0);

function card(id: string): StudyCard {
  return {id, state: newCardState(now)};
}

function answered(cardId: string, at: Date = now): ReviewLogEntry {
  return {
    cardId,
    rating: "good",
    phaseBefore: "new",
    reviewedAt: at.toISOString(),
    scheduledDays: 0,
    due: at.toISOString(),
  };
}

it("holds back the other card of a word answered today", () => {
  const cards = [card("water/a"), card("water/b"), card("rice/a")];

  expect(heldBackCards(cards, [answered("water/a")], now).map(held => held.id)).toEqual(["water/b"]);
});

it("does not hold back the card that was answered itself", () => {
  expect(heldBackCards([card("water/a")], [answered("water/a")], now)).toEqual([]);
});

it("holds nothing back when the sibling was answered on an earlier study day", () => {
  const yesterday = new Date(2026, 9, 4, 10, 0);

  expect(heldBackCards([card("water/b")], [answered("water/a", yesterday)], now)).toEqual([]);
});
