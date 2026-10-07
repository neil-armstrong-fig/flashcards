import {readSyncAnswer} from "@src/redux/api/sync-with-api/utils/ReadSyncAnswer";

const AT = "2026-10-05T10:00:00.000Z";
const EVENT = {cardId: "ko-vocab-water/to-english", kind: "hard", at: AT};
const SETTING = {name: "dailyGoalCards", value: 45, at: AT};
const RECORD = {kind: "similar", id: "ko-vocab-water|볼", at: AT, deleted: true};
const ANSWER = {
  cursor: 4,
  more: false,
  events: [EVENT],
  settings: [SETTING],
  recordCursor: 9,
  moreRecords: true,
  records: [RECORD],
};

it("reads an answer, with its cursors and what came with them", () => {
  expect(readSyncAnswer(ANSWER)).toEqual(ANSWER);
});

it("leaves out an event, a setting or a record that does not check out, and keeps the rest", () => {
  const answer = readSyncAnswer({
    ...ANSWER,
    events: [EVENT, {cardId: "c", kind: "delete", at: AT}],
    settings: [{name: "theme", value: "dark", at: AT}, SETTING],
    records: [RECORD, {kind: "deck", id: "x", at: AT, deleted: true}],
  });

  expect(answer).toEqual(ANSWER);
});

it.each([
  ["nothing", undefined],
  ["null", null],
  ["text", "ok"],
  ["no cursor", {...ANSWER, cursor: undefined}],
  ["a cursor that is not a number", {...ANSWER, cursor: "4"}],
  ["a more that is not true or false", {...ANSWER, more: "no"}],
  ["events that are not a list", {...ANSWER, events: {}}],
  ["settings that are not a list", {...ANSWER, settings: undefined}],
  ["no record cursor", {...ANSWER, recordCursor: undefined}],
  ["a moreRecords that is not true or false", {...ANSWER, moreRecords: 1}],
  ["records that are not a list", {...ANSWER, records: "none"}],
])("is not an answer when it has %s", (_name, body) => {
  expect(readSyncAnswer(body)).toBeUndefined();
});
