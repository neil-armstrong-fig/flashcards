import {MAX_EVENTS_PER_REQUEST} from "@src/router/routes/sync/sync-card-events/utils/MaxEventsPerRequest";
import {MAX_SETTINGS_PER_REQUEST} from "@src/router/routes/sync/sync-card-events/utils/MaxSettingsPerRequest";
import {MAX_RECORDS_PER_REQUEST} from "@src/router/routes/sync/sync-card-events/utils/MaxRecordsPerRequest";
import {readCardEvent} from "@flashcards/shared/sync/card-events/CardEvent";
import {readRecordChange} from "@flashcards/shared/sync/records/RecordChange";
import {readSettingChange} from "@flashcards/shared/sync/settings/SettingChange";
import type {RecordChange} from "@flashcards/shared/sync/records/RecordChange";
import type {SettingChange} from "@flashcards/shared/sync/settings/SettingChange";
import type {CardEvent} from "@flashcards/shared/sync/card-events/CardEvent";
import type {SyncRequest} from "@src/router/routes/sync/shared/types/SyncRequest";

/** What a device sent, or `undefined` if any of it is not what it should be: nothing is kept from a request that is half wrong. */
export function syncRequestFrom(body: unknown): SyncRequest | undefined {
  if (typeof body !== "object" || body === null) {
    return undefined;
  }

  const {cursor, events, settings, recordCursor, records} = body as Record<string, unknown>;

  if (typeof cursor !== "number" || !Number.isInteger(cursor) || cursor < 0) {
    return undefined;
  }

  if (!Array.isArray(events) || events.length > MAX_EVENTS_PER_REQUEST) {
    return undefined;
  }

  const read = (events as unknown[]).map(readCardEvent);

  if (!read.every((event): event is CardEvent => event !== undefined)) {
    return undefined;
  }

  const changes = settingChangesFrom(settings);

  const made = recordChangesFrom(records);
  const readTo = recordCursor ?? 0;

  if (changes === undefined || made === undefined) {
    return undefined;
  }

  if (typeof readTo !== "number" || !Number.isInteger(readTo) || readTo < 0) {
    return undefined;
  }

  return {cursor, events: read, settings: changes, recordCursor: readTo, records: made};
}

/** Each moment is written the one way (UTC, to the millisecond), because the database compares them as text to find the later. */
function settingChangesFrom(settings: unknown): SettingChange[] | undefined {
  if (settings === undefined) {
    return [];
  }

  if (!Array.isArray(settings) || settings.length > MAX_SETTINGS_PER_REQUEST) {
    return undefined;
  }

  const read = (settings as unknown[]).map(readSettingChange);

  if (!read.every((change): change is SettingChange => change !== undefined)) {
    return undefined;
  }

  return read.map(change => ({...change, at: new Date(change.at).toISOString()}));
}

/** Each moment is written the one way here too. */
function recordChangesFrom(records: unknown): RecordChange[] | undefined {
  if (records === undefined) {
    return [];
  }

  if (!Array.isArray(records) || records.length > MAX_RECORDS_PER_REQUEST) {
    return undefined;
  }

  const read = (records as unknown[]).map(readRecordChange);

  if (!read.every((record): record is RecordChange => record !== undefined)) {
    return undefined;
  }

  return read.map(record => ({...record, at: new Date(record.at).toISOString()}));
}
