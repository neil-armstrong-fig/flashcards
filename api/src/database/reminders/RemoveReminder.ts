import {and, eq} from "drizzle-orm";
import {database} from "@src/database/Database";
import {pushSubscriptions} from "@src/database/schema/PushSubscriptions";

/** Forgets a device, so it is reminded no more. */
export async function removeReminder(userId: string, endpoint: string): Promise<void> {
  await database
    .delete(pushSubscriptions)
    .where(and(eq(pushSubscriptions.userId, userId), eq(pushSubscriptions.endpoint, endpoint)));
}
