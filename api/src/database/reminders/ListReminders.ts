import {database} from "@src/database/Database";
import {pushSubscriptions} from "@src/database/schema/PushSubscriptions";
import type {StoredReminder} from "@src/database/types/StoredReminder";

/** Every device to remind, for whichever account. A private app has few; the hour is checked against each by `isReminderDue`. */
export async function listReminders(): Promise<StoredReminder[]> {
  const rows = await database.select().from(pushSubscriptions);

  return rows.map(({userId, endpoint, hour, timeZone, goalMetOn, lastSentOn}) => ({
    userId,
    endpoint,
    hour,
    timeZone,
    ...(goalMetOn !== null && {goalMetOn}),
    ...(lastSentOn !== null && {lastSentOn}),
  }));
}
