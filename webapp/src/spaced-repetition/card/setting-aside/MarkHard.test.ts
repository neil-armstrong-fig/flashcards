import {markHard} from "@src/spaced-repetition/card/setting-aside/MarkHard";
import {newCardState} from "@src/spaced-repetition/card/NewCardState";

const now = new Date(2026, 9, 5, 10, 0);

it("notes when the learner marked the card, and changes nothing else about it", () => {
  const card = newCardState(now);

  expect(markHard(card, now)).toEqual({...card, markedHardAt: now.toISOString()});
});

it("starts the count again when a card already marked is marked again", () => {
  const later = new Date(2026, 9, 9, 10, 0);

  expect(markHard(markHard(newCardState(now), now), later).markedHardAt).toBe(later.toISOString());
});
