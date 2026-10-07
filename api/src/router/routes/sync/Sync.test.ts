import {api} from "@src/testing/ApiHarness";

interface AnswerProps {
  readonly cardId: string;
  readonly at: string;
}

function answer({cardId = "ko-vocab-water", at = "2026-10-01T10:00:00.000Z"}: Partial<AnswerProps> = {}): Record<
  string,
  unknown
> {
  return {cardId, kind: "answer", at, rating: "good", retention: 0.9};
}

const FIRST = answer();
const SECOND = {cardId: "ko-vocab-water", kind: "suspend", at: "2026-10-01T10:05:00.000Z"};

async function sync(cookie: string, cursor: number, events: unknown[], settings?: unknown[]): Promise<Response> {
  return await api.send("/api/sync", {method: "POST", cookie, body: {cursor, events, settings}});
}

const GOAL_AT_TEN = {name: "dailyGoalCards", value: 45, at: "2026-10-01T10:00:00.000Z"};
const GOAL_AT_ELEVEN = {name: "dailyGoalCards", value: 30, at: "2026-10-01T11:00:00.000Z"};

async function settingsOf(cookie: string): Promise<unknown[]> {
  return ((await (await sync(cookie, 0, [])).json()) as {settings: unknown[]}).settings;
}

it("asks for a sign-in", async () => {
  expect((await api.send("/api/sync", {method: "POST", body: {cursor: 0, events: []}})).status).toBe(401);
});

it("starts with nothing and a cursor of zero", async () => {
  const cookie = await api.signIn();

  expect(await (await sync(cookie, 0, [])).json()).toEqual({
    cursor: 0,
    more: false,
    events: [],
    settings: [],
    recordCursor: 0,
    moreRecords: false,
    records: [],
  });
});

it("keeps what a device sends and hands it to another device that asks from the start", async () => {
  const cookie = await api.signIn();

  await sync(cookie, 0, [FIRST, SECOND]);
  const other = (await (await sync(cookie, 0, [])).json()) as {cursor: number; events: unknown[]};

  expect(other.events).toEqual([FIRST, SECOND]);
  expect(other.cursor).toBeGreaterThan(0);
});

it("hands over only what came after the cursor", async () => {
  const cookie = await api.signIn();
  const {cursor} = (await (await sync(cookie, 0, [FIRST])).json()) as {cursor: number};

  const next = (await (await sync(cookie, cursor, [SECOND])).json()) as {events: unknown[]};

  expect(next.events).toEqual([SECOND]);
});

it("keeps an event once however often it is sent", async () => {
  const cookie = await api.signIn();

  await sync(cookie, 0, [FIRST]);
  await sync(cookie, 0, [FIRST]);

  expect(((await (await sync(cookie, 0, [])).json()) as {events: unknown[]}).events).toEqual([FIRST]);
});

it("keeps each account's events to itself", async () => {
  const mine = await api.signIn();

  await sync(mine, 0, [FIRST]);

  const {testGoogle} = await import("@src/testing/google/TestGoogle");

  testGoogle.identity = {subject: "google-2", email: "me@example.com", emailVerified: true};
  const theirs = await api.signIn();

  expect(await (await sync(theirs, 0, [])).json()).toEqual({
    cursor: 0,
    more: false,
    events: [],
    settings: [],
    recordCursor: 0,
    moreRecords: false,
    records: [],
  });
});

it("says there is more when a page is full, and the next page carries on", async () => {
  const cookie = await api.signIn();
  const many = Array.from({length: 150}, (_, index) =>
    answer({
      cardId: "c",
      at: `2026-10-01T10:00:${String(index % 60).padStart(2, "0")}.${String(index).padStart(3, "0")}Z`,
    }),
  );

  await sync(cookie, 0, many.slice(0, 100));
  await sync(cookie, 0, many.slice(100));
  const page = (await (await sync(cookie, 0, [])).json()) as {cursor: number; more: boolean; events: unknown[]};
  const rest = (await (await sync(cookie, page.cursor, [])).json()) as {more: boolean; events: unknown[]};

  expect([page.events.length, page.more, rest.events.length, rest.more]).toEqual([100, true, 50, false]);
});

it.each([
  ["no events", {cursor: 0}],
  ["a cursor that is not a whole number", {cursor: 1.5, events: []}],
  ["a negative cursor", {cursor: -1, events: []}],
  ["an event that is not one", {cursor: 0, events: [{cardId: "c", kind: "delete", at: FIRST.at}]}],
  ["more than a hundred events", {cursor: 0, events: Array.from({length: 101}, () => FIRST)}],
  ["not JSON", "nope"],
])("refuses %s", async (_name, body) => {
  const cookie = await api.signIn();

  expect((await api.send("/api/sync", {method: "POST", cookie, body})).status).toBe(400);
});

it("keeps a setting and hands it to every device", async () => {
  const cookie = await api.signIn();

  await sync(cookie, 0, [], [GOAL_AT_TEN]);

  expect(await settingsOf(cookie)).toEqual([GOAL_AT_TEN]);
});

it("keeps the later choice of a setting, whichever device sends it last", async () => {
  const cookie = await api.signIn();

  await sync(cookie, 0, [], [GOAL_AT_ELEVEN]);
  await sync(cookie, 0, [], [GOAL_AT_TEN]);

  expect(await settingsOf(cookie)).toEqual([GOAL_AT_ELEVEN]);

  await sync(cookie, 0, [], [{...GOAL_AT_ELEVEN, value: 50, at: "2026-10-01T12:00:00.000Z"}]);

  expect(await settingsOf(cookie)).toEqual([{...GOAL_AT_ELEVEN, value: 50, at: "2026-10-01T12:00:00.000Z"}]);
});

it("keeps each account's settings to itself", async () => {
  const mine = await api.signIn();

  await sync(mine, 0, [], [GOAL_AT_TEN]);

  const {testGoogle} = await import("@src/testing/google/TestGoogle");

  testGoogle.identity = {subject: "google-2", email: "me@example.com", emailVerified: true};

  expect(await settingsOf(await api.signIn())).toEqual([]);
});

it.each([
  ["a setting that stays on the device", [{name: "theme", value: "dark", at: GOAL_AT_TEN.at}]],
  ["settings that are not a list", "dailyGoalCards"],
  ["more settings than there are", Array.from({length: 21}, () => GOAL_AT_TEN)],
])("refuses %s", async (_name, settings) => {
  const cookie = await api.signIn();

  expect((await api.send("/api/sync", {method: "POST", cookie, body: {cursor: 0, events: [], settings}})).status).toBe(
    400,
  );
});

it("compares the moments of two choices as moments, and keeps them written the one way", async () => {
  const cookie = await api.signIn();

  await sync(cookie, 0, [], [{...GOAL_AT_ELEVEN, at: "2026-10-01T12:00:00+01:00"}]);
  await sync(cookie, 0, [], [{...GOAL_AT_TEN, at: "2026-10-01T10:30:00.000Z"}]);

  expect(await settingsOf(cookie)).toEqual([GOAL_AT_ELEVEN]);
});

const ELEPHANT_AT_TEN = {
  kind: "note",
  id: "ko-custom-elephant",
  at: "2026-10-01T10:00:00.000Z",
  deleted: false,
  payload: {word: "코끼리", meaning: "elephant", romanisation: "kokkiri"},
};
const ELEPHANT_GONE_AT_ELEVEN = {kind: "note", id: "ko-custom-elephant", at: "2026-10-01T11:00:00.000Z", deleted: true};
const BALL = {
  kind: "similar",
  id: "ko-vocab-fire|볼",
  at: "2026-10-01T10:00:00.000Z",
  deleted: false,
  payload: {noteId: "ko-vocab-fire", text: "볼"},
};

async function syncRecords(cookie: string, recordCursor: number, records: unknown[]): Promise<RecordsAnswer> {
  const sent = await api.send("/api/sync", {
    method: "POST",
    cookie,
    body: {cursor: 0, events: [], recordCursor, records},
  });

  return (await sent.json()) as RecordsAnswer;
}

interface RecordsAnswer {
  readonly recordCursor: number;
  readonly moreRecords: boolean;
  readonly records: unknown[];
}

it("keeps what a device made and hands it to another device that asks from the start", async () => {
  const cookie = await api.signIn();

  await syncRecords(cookie, 0, [ELEPHANT_AT_TEN, BALL]);
  const other = await syncRecords(cookie, 0, []);

  expect(other.records).toEqual([ELEPHANT_AT_TEN, BALL]);
  expect(other.recordCursor).toBeGreaterThan(0);
});

it("hands over only the records changed after the cursor, and a changed record again", async () => {
  const cookie = await api.signIn();
  const {recordCursor} = await syncRecords(cookie, 0, [ELEPHANT_AT_TEN, BALL]);

  await syncRecords(cookie, recordCursor, [ELEPHANT_GONE_AT_ELEVEN]);

  expect((await syncRecords(cookie, recordCursor, [])).records).toEqual([ELEPHANT_GONE_AT_ELEVEN]);
});

it("keeps a removal as a record, so a device that has not heard of it yet is told", async () => {
  const cookie = await api.signIn();

  await syncRecords(cookie, 0, [ELEPHANT_AT_TEN]);
  await syncRecords(cookie, 0, [ELEPHANT_GONE_AT_ELEVEN]);

  expect((await syncRecords(cookie, 0, [])).records).toEqual([ELEPHANT_GONE_AT_ELEVEN]);
});

it("keeps the later change to a record, whichever device sends it last", async () => {
  const cookie = await api.signIn();

  await syncRecords(cookie, 0, [ELEPHANT_GONE_AT_ELEVEN]);
  await syncRecords(cookie, 0, [ELEPHANT_AT_TEN]);

  expect((await syncRecords(cookie, 0, [])).records).toEqual([ELEPHANT_GONE_AT_ELEVEN]);
});

it("keeps a record once however often it is sent", async () => {
  const cookie = await api.signIn();

  const first = await syncRecords(cookie, 0, [ELEPHANT_AT_TEN]);
  const again = await syncRecords(cookie, 0, [ELEPHANT_AT_TEN]);

  expect(again.records).toEqual([ELEPHANT_AT_TEN]);
  expect(again.recordCursor).toBe(first.recordCursor);
});

it("keeps each account's records to itself", async () => {
  const mine = await api.signIn();

  await syncRecords(mine, 0, [ELEPHANT_AT_TEN]);

  const {testGoogle} = await import("@src/testing/google/TestGoogle");

  testGoogle.identity = {subject: "google-2", email: "me@example.com", emailVerified: true};

  expect((await syncRecords(await api.signIn(), 0, [])).records).toEqual([]);
});

it("pages the records a hundred at a time, and says when there are more", async () => {
  const cookie = await api.signIn();
  const note = (index: number): Record<string, unknown> => ({
    ...ELEPHANT_AT_TEN,
    id: `ko-custom-n${index}`,
  });

  await syncRecords(
    cookie,
    0,
    Array.from({length: 100}, (_, index) => note(index)),
  );
  await syncRecords(
    cookie,
    0,
    Array.from({length: 50}, (_, index) => note(100 + index)),
  );
  const page = await syncRecords(cookie, 0, []);
  const rest = await syncRecords(cookie, page.recordCursor, []);

  expect([page.records.length, page.moreRecords, rest.records.length, rest.moreRecords]).toEqual([
    100,
    true,
    50,
    false,
  ]);
});

it("compares the moments of two changes as moments, and keeps them written the one way", async () => {
  const cookie = await api.signIn();

  await syncRecords(cookie, 0, [{...ELEPHANT_GONE_AT_ELEVEN, at: "2026-10-01T12:00:00+01:00"}]);
  await syncRecords(cookie, 0, [ELEPHANT_AT_TEN]);

  expect((await syncRecords(cookie, 0, [])).records).toEqual([ELEPHANT_GONE_AT_ELEVEN]);
});

it.each([
  ["a note whose word is not Korean", [{...ELEPHANT_AT_TEN, payload: {...ELEPHANT_AT_TEN.payload, word: "elephant"}}]],
  ["a kind that is not kept", [{...ELEPHANT_AT_TEN, kind: "deck"}]],
  ["records that are not a list", "note"],
  ["more than a hundred records", Array.from({length: 101}, () => ELEPHANT_AT_TEN)],
])("refuses %s", async (_name, records) => {
  const cookie = await api.signIn();

  const sent = await api.send("/api/sync", {method: "POST", cookie, body: {cursor: 0, events: [], records}});

  expect(sent.status).toBe(400);
});
