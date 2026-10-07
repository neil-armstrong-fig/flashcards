import {readCardEvent} from "@flashcards/shared/sync/card-events/CardEvent";
import {readRecordChange} from "@flashcards/shared/sync/records/RecordChange";
import {readSettingChange} from "@flashcards/shared/sync/settings/SettingChange";
import type {SyncAnswer} from "@src/redux/api/types/SyncAnswer";

/**
 * What the API answered to a sync, or `undefined` if the answer is not the shape it should be. Each event, setting and record in it is
 * checked on its own and one that does not check out is left out, so a bad one cannot stop the rest being taken in.
 */
export function readSyncAnswer(body: unknown): SyncAnswer | undefined {
  if (typeof body !== "object" || body === null) {
    return undefined;
  }

  const {cursor, more, events, settings, recordCursor, moreRecords, records} = body as Record<string, unknown>;

  if (
    typeof cursor !== "number" ||
    typeof more !== "boolean" ||
    !Array.isArray(events) ||
    !Array.isArray(settings) ||
    typeof recordCursor !== "number" ||
    typeof moreRecords !== "boolean" ||
    !Array.isArray(records)
  ) {
    return undefined;
  }

  return {
    cursor,
    more,
    events: events.flatMap(each => readCardEvent(each) ?? []),
    settings: settings.flatMap(each => readSettingChange(each) ?? []),
    recordCursor,
    moreRecords,
    records: records.flatMap(each => readRecordChange(each) ?? []),
  };
}
