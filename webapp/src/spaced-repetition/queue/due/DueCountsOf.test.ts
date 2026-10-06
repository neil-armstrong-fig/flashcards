import {dueCountsOf} from "@src/spaced-repetition/queue/due/DueCountsOf";
import {newCardState} from "@src/spaced-repetition/card/NewCardState";
import type {CardPhase} from "@src/spaced-repetition/card/CardPhase";
import type {StudyCard} from "@src/spaced-repetition/card/types/StudyCard";

const now = new Date(2026, 9, 5, 10, 0);

function card(id: string, phase: CardPhase): StudyCard {
  return {id, state: {...newCardState(now), phase}};
}

it("counts nothing when nothing is waiting", () => {
  expect(dueCountsOf([])).toEqual({new: 0, learning: 0, review: 0});
});

it("counts each kind of card on its own", () => {
  const cards = [card("a", "new"), card("b", "new"), card("c", "review"), card("d", "learning")];

  expect(dueCountsOf(cards)).toEqual({new: 2, learning: 1, review: 1});
});

it("counts a card being relearned with those being learned", () => {
  expect(dueCountsOf([card("a", "relearning"), card("b", "learning")])).toEqual({new: 0, learning: 2, review: 0});
});
