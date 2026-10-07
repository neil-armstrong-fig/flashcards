import {listRecordChangesAfter} from "@src/database/sync/ListRecordChangesAfter";
import {MAX_RECORDS_PER_REQUEST} from "@src/router/routes/sync/sync-card-events/utils/MaxRecordsPerRequest";
import {saveRecordChanges} from "@src/database/sync/SaveRecordChanges";
import {listSettingChanges} from "@src/database/sync/ListSettingChanges";
import {saveSettingChanges} from "@src/database/sync/SaveSettingChanges";
import {listCardEventsAfter} from "@src/database/sync/ListCardEventsAfter";
import {respondEmpty} from "@src/router/respond/RespondEmpty";
import {respondJson} from "@src/router/respond/RespondJson";
import {saveCardEvents} from "@src/database/sync/SaveCardEvents";
import {syncRequestFrom} from "@src/router/routes/sync/sync-card-events/utils/SyncRequestFrom";
import type {Account} from "@src/database/types/Account";

/** The most events one answer carries: a device that is far behind asks again from the cursor it was given. */
const PAGE_SIZE = 100;

/**
 * `POST /api/sync` with `{cursor, events}`: keeps the events and the settings the device sends (a setting only if it is a later choice than the one kept), then answers with the account's events after the
 * cursor, in the order they came in, and the cursor to ask from next, with every setting the account has chosen. Records (what the learner made: `docs/sync.md`) go the same way with their own cursor: the later change to a record wins, a removal is a record, and a hundred come back at a time. `more` is true when the page was full. The device's own events
 * come back too: it knows them by their id and ignores them.
 */
export async function syncCardEvents(request: Request, account: Account): Promise<Response> {
  const sent = syncRequestFrom(await request.json().catch(() => undefined));

  if (sent === undefined) {
    return respondEmpty(400);
  }

  await saveCardEvents(account.id, sent.events);
  await saveSettingChanges(account.id, sent.settings);
  await saveRecordChanges(account.id, sent.records);

  const page = await listCardEventsAfter(account.id, sent.cursor, PAGE_SIZE + 1);
  const shown = page.slice(0, PAGE_SIZE);

  const madePage = await listRecordChangesAfter(account.id, sent.recordCursor, MAX_RECORDS_PER_REQUEST + 1);
  const madeShown = madePage.slice(0, MAX_RECORDS_PER_REQUEST);

  return respondJson({
    cursor: shown.at(-1)?.seq ?? sent.cursor,
    more: page.length > PAGE_SIZE,
    events: shown.map(({event}) => event),
    settings: await listSettingChanges(account.id),
    recordCursor: madeShown.at(-1)?.seq ?? sent.recordCursor,
    moreRecords: madePage.length > MAX_RECORDS_PER_REQUEST,
    records: madeShown.map(({record}) => record),
  });
}
