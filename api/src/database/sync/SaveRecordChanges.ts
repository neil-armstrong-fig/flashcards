import {sql} from "drizzle-orm";
import {database} from "@src/database/Database";
import {syncedRecords} from "@src/database/schema/SyncedRecords";
import type {RecordChange} from "@flashcards/shared/sync/records/RecordChange";

/**
 * Keeps records for an account, each only if it is a later change than the one kept (a single conditional statement, as D1 has no
 * transactions): so two devices sending at once leave the later change, and a request sent twice changes nothing. A record that
 * changes takes the next `seq`, so devices that have read past it read it again.
 */
export async function saveRecordChanges(userId: string, changes: readonly RecordChange[]): Promise<void> {
  const [first, ...rest] = changes.map(({kind, id, at, deleted, payload}) => {
    return database
      .insert(syncedRecords)
      .values({userId, kind, id, at, deleted, payload: payloadOf(payload)})
      .onConflictDoUpdate({
        target: [syncedRecords.userId, syncedRecords.kind, syncedRecords.id],
        set: {
          at: sql`excluded.at`,
          deleted: sql`excluded.deleted`,
          payload: sql`excluded.payload`,
          seq: sql`(select coalesce(max(seq), 0) + 1 from synced_records)`,
        },
        setWhere: sql`excluded.at > ${syncedRecords.at}`,
      });
  });

  if (!first) {
    return;
  }

  await database.batch([first, ...rest]);
}

function payloadOf(payload: RecordChange["payload"]): string | null {
  if (payload === undefined) {
    return null;
  }

  return JSON.stringify(payload);
}
