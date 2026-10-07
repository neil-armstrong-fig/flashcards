import {sql} from "drizzle-orm";
import {database} from "@src/database/Database";
import {syncedSettings} from "@src/database/schema/SyncedSettings";
import type {SettingChange} from "@flashcards/shared/sync/settings/SettingChange";

/**
 * Keeps settings for an account, each only if it was chosen later than the one kept (a single conditional statement, as D1 has no
 * transactions): so two devices sending at once leave the later choice, and a request sent twice changes nothing.
 */
export async function saveSettingChanges(userId: string, changes: readonly SettingChange[]): Promise<void> {
  const [first, ...rest] = changes.map(({name, value, at}) => {
    return database
      .insert(syncedSettings)
      .values({userId, name, value: JSON.stringify(value), at})
      .onConflictDoUpdate({
        target: [syncedSettings.userId, syncedSettings.name],
        set: {value: sql`excluded.value`, at: sql`excluded.at`},
        setWhere: sql`excluded.at > ${syncedSettings.at}`,
      });
  });

  if (!first) {
    return;
  }

  await database.batch([first, ...rest]);
}
