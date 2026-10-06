import {newCardState} from "@src/spaced-repetition/card/NewCardState";
import {readCardState} from "@src/spaced-repetition/card/ReadCardState";

const valid = newCardState(new Date("2026-10-05T10:00:00Z"));

it("reads back a state that was stored", () => {
  expect(readCardState(JSON.parse(JSON.stringify(valid)))).toEqual(valid);
});

it.each([
  ["nothing", undefined],
  ["a string", "new"],
  ["a missing field", {...valid, due: undefined}],
  ["an unknown phase", {...valid, phase: "buried"}],
  ["a date that is not one", {...valid, due: "tomorrow-ish"}],
  ["a number that is not finite", {...valid, stability: Number.NaN}],
])("refuses %s", (_name, stored) => {
  expect(readCardState(stored)).toBeUndefined();
});

it("reads a card stored before suspending and burying existed as neither suspended, buried nor marked hard", () => {
  const {suspended: _suspended, buriedUntil: _buriedUntil, markedHardAt: _markedHardAt, ...legacy} = valid;

  expect(readCardState(JSON.parse(JSON.stringify(legacy)))).toEqual(valid);
});

it("refuses a suspended flag that is not a boolean", () => {
  expect(readCardState({...valid, suspended: "yes"})).toBeUndefined();
});

it("reads back the moment a card was marked as hard, and refuses one that is not a time", () => {
  const marked = {...valid, markedHardAt: "2026-10-05T10:00:00.000Z"};

  expect(readCardState(JSON.parse(JSON.stringify(marked)))).toEqual(marked);
  expect(readCardState({...valid, markedHardAt: "sometime"})).toBeUndefined();
});

it("reads a card stored with `null` for a moment it has not had as having none", () => {
  const stored = {...valid, lastReview: null, markedHardAt: null, buriedUntil: null};

  expect(readCardState(stored)).toEqual(valid);
  expect(readCardState(stored)?.lastReview).toBeUndefined();
});
