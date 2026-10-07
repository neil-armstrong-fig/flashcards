import {isLaterChoice} from "@flashcards/shared/sync/IsLaterChoice";
import {readRecordChange} from "@flashcards/shared/sync/records/RecordChange";
import {readSettingChange} from "@flashcards/shared/sync/settings/SettingChange";
import type {FakeAccount} from "@src/dsl/web-app/playwright/fake-api/FakeAccount";
import type {FakeSyncAnswer} from "@src/dsl/web-app/playwright/fake-api/FakeSyncAnswer";
import type {FakeSyncBody} from "@src/dsl/web-app/playwright/fake-api/FakeSyncBody";

const PAGE_SIZE = 100;

/**
 * What `POST /api/sync` answers: the events the device sent are kept (one the API already has is not kept twice), then the events
 * after its cursor come back with the new cursor. As faithful as the real one needs to be, no more: it does not check the events,
 * since the app sends only what it made.
 */
export function syncAnswer(account: FakeAccount, body: unknown): FakeSyncAnswer {
  const kept = account.events;
  const {cursor, events, settings, recordCursor, records} = bodyOf(body);

  for (const event of events) {
    if (!kept.some(each => JSON.stringify(each) === JSON.stringify(event))) {
      kept.push(event);
    }
  }

  for (const change of settings) {
    keepSetting(account, change);
  }

  for (const change of records) {
    keepRecord(account, change);
  }

  const page = kept.slice(cursor, cursor + PAGE_SIZE);
  const madePage = account.records.filter(each => each.seq > recordCursor).slice(0, PAGE_SIZE + 1);
  const madeShown = madePage.slice(0, PAGE_SIZE);

  return {
    cursor: cursor + page.length,
    more: kept.length > cursor + page.length,
    events: page,
    settings: Object.entries(account.settings).map(([name, {value, at}]) => ({name, value, at})),
    recordCursor: madeShown.at(-1)?.seq ?? recordCursor,
    moreRecords: madePage.length > PAGE_SIZE,
    records: madeShown.map(({record}) => record),
  };
}

function bodyOf(body: unknown): FakeSyncBody {
  if (typeof body !== "object" || body === null) {
    return {cursor: 0, events: [], settings: [], recordCursor: 0, records: []};
  }

  const {cursor, events, settings, recordCursor, records} = body as Record<string, unknown>;

  return {
    cursor: typeof cursor === "number" ? cursor : 0,
    events: Array.isArray(events) ? (events as unknown[]) : [],
    settings: Array.isArray(settings) ? (settings as unknown[]) : [],
    recordCursor: typeof recordCursor === "number" ? recordCursor : 0,
    records: Array.isArray(records) ? (records as unknown[]) : [],
  };
}

/** Keeps a setting if it was chosen later than the one kept, as the API does. */
function keepSetting(account: FakeAccount, change: unknown): void {
  const readable = readSettingChange(change);

  if (readable && isLaterChoice(readable.at, account.settings[readable.name]?.at)) {
    account.settings[readable.name] = {value: readable.value, at: readable.at};
  }
}

/** Keeps a record if it is a later change than the one kept, and gives it the next place in the order, as the API does. */
function keepRecord(account: FakeAccount, change: unknown): void {
  const record = readRecordChange(change);

  if (!record) {
    return;
  }

  const at = new Date(record.at).toISOString();
  const index = account.records.findIndex(each => each.record.kind === record.kind && each.record.id === record.id);
  const kept = account.records[index];

  if (kept && !isLaterChoice(at, kept.record.at)) {
    return;
  }

  const seq = Math.max(0, ...account.records.map(each => each.seq)) + 1;

  if (kept) {
    account.records.splice(index, 1);
  }

  account.records.push({seq, record: {...record, at}});
}
