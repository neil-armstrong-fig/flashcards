import {eq} from "drizzle-orm";
import {database} from "@src/database/Database";
import {readSettingChange} from "@flashcards/shared/sync/settings/SettingChange";
import {syncedSettings} from "@src/database/schema/SyncedSettings";
import type {SettingChange} from "@flashcards/shared/sync/settings/SettingChange";

/** Every setting an account has chosen, as last chosen. */
export async function listSettingChanges(userId: string): Promise<SettingChange[]> {
  const rows = await database.select().from(syncedSettings).where(eq(syncedSettings.userId, userId));

  return rows.flatMap(({name, value, at}) => {
    const change = readSettingChange({name, value: parsed(value), at});

    if (!change) {
      return [];
    }

    return [change];
  });
}

function parsed(json: string): unknown {
  try {
    return JSON.parse(json) as unknown;
  } catch {
    return undefined;
  }
}
