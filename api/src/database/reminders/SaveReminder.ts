import {sql} from "drizzle-orm";
import {database} from "@src/database/Database";
import {pushSubscriptions} from "@src/database/schema/PushSubscriptions";
import type {NewReminder} from "@src/database/types/NewReminder";

/** Keeps a device to remind, or moves the hour of one already kept: what was last sent to it, and whether the goal was met, stay. */
export async function saveReminder(userId: string, {endpoint, hour, timeZone}: NewReminder): Promise<void> {
  await database
    .insert(pushSubscriptions)
    .values({userId, endpoint, hour, timeZone})
    .onConflictDoUpdate({
      target: [pushSubscriptions.userId, pushSubscriptions.endpoint],
      set: {hour: sql`excluded.hour`, timeZone: sql`excluded.time_zone`},
    });
}
