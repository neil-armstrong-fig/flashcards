import {and, asc, eq, gt} from "drizzle-orm";
import {database} from "@src/database/Database";
import {readRecordChange} from "@flashcards/shared/sync/records/RecordChange";
import {syncedRecords} from "@src/database/schema/SyncedRecords";
import type {StoredRecordChange} from "@src/database/types/StoredRecordChange";

/** An account's records that changed after `cursor`, in the order they changed, at most `limit`. */
export async function listRecordChangesAfter(
  userId: string,
  cursor: number,
  limit: number,
): Promise<StoredRecordChange[]> {
  const rows = await database
    .select()
    .from(syncedRecords)
    .where(and(eq(syncedRecords.userId, userId), gt(syncedRecords.seq, cursor)))
    .orderBy(asc(syncedRecords.seq))
    .limit(limit);

  return rows.flatMap(({seq, kind, id, at, deleted, payload}) => {
    const record = readRecordChange({kind, id, at, deleted, payload: parsed(payload)});

    if (!record) {
      return [];
    }

    return [{seq, record}];
  });
}

function parsed(json: string | null): unknown {
  if (json === null) {
    return undefined;
  }

  try {
    return JSON.parse(json) as unknown;
  } catch {
    return undefined;
  }
}
