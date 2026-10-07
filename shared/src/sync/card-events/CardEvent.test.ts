import {readCardEvent} from "@flashcards/shared/sync/card-events/CardEvent";

const at = "2026-10-05T10:00:00.000Z";

it("reads an answer with its rating and retention", () => {
  const event = {cardId: "c1", kind: "answer", at, rating: "good", retention: 0.9};

  expect(readCardEvent(event)).toEqual(event);
});

it("reads a bury with the moment it ends", () => {
  const event = {cardId: "c1", kind: "bury", at, until: "2026-10-06T03:00:00.000Z"};

  expect(readCardEvent(event)).toEqual(event);
});

it("reads a suspend, an unsuspend and a hard as just a card and a moment, dropping anything extra", () => {
  expect(readCardEvent({cardId: "c1", kind: "suspend", at, rating: "good"})).toEqual({
    cardId: "c1",
    kind: "suspend",
    at,
  });
  expect(readCardEvent({cardId: "c1", kind: "unsuspend", at})).toEqual({cardId: "c1", kind: "unsuspend", at});
  expect(readCardEvent({cardId: "c1", kind: "hard", at})).toEqual({cardId: "c1", kind: "hard", at});
});

it.each([
  ["not an object", "answer"],
  ["null", null],
  ["an unknown kind", {cardId: "c1", kind: "delete", at}],
  ["no card", {kind: "hard", at}],
  ["a bad moment", {cardId: "c1", kind: "hard", at: "yesterday"}],
  ["an answer with no rating", {cardId: "c1", kind: "answer", at, retention: 0.9}],
  ["an answer with a retention of 1", {cardId: "c1", kind: "answer", at, rating: "good", retention: 1}],
  ["a bury with no end", {cardId: "c1", kind: "bury", at}],
])("refuses %s", (_name, value) => {
  expect(readCardEvent(value)).toBeUndefined();
});
