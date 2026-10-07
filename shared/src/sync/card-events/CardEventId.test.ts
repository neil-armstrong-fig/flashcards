import {cardEventId} from "@flashcards/shared/sync/card-events/CardEventId";

it("is the same for the same event and different when the kind differs", () => {
  const at = "2026-10-05T10:00:00.000Z";

  expect(cardEventId({cardId: "c1", kind: "hard", at})).toBe(cardEventId({cardId: "c1", kind: "hard", at}));
  expect(cardEventId({cardId: "c1", kind: "hard", at})).not.toBe(cardEventId({cardId: "c1", kind: "suspend", at}));
});
