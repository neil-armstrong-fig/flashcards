import {and, eq} from "drizzle-orm";
import {database} from "@src/database/Database";
import {pushSubscriptions} from "@src/database/schema/PushSubscriptions";

/** Notes that a device was sent its reminder for a study day. */
export async function markReminderSent(userId: string, endpoint: string, studyDay: string): Promise<void> {
  await database
    .update(pushSubscriptions)
    .set({lastSentOn: studyDay})
    .where(and(eq(pushSubscriptions.userId, userId), eq(pushSubscriptions.endpoint, endpoint)));
}
