import {eq} from "drizzle-orm";
import {database} from "@src/database/Database";
import {pushSubscriptions} from "@src/database/schema/PushSubscriptions";

/** Notes that an account's daily goal was reached on a study day, on each of its devices, so none of them is reminded that day. */
export async function recordGoalMet(userId: string, studyDay: string): Promise<void> {
  await database.update(pushSubscriptions).set({goalMetOn: studyDay}).where(eq(pushSubscriptions.userId, userId));
}
