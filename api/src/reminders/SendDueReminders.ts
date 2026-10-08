import {isReminderDue} from "@src/reminders/due/IsReminderDue";
import {listReminders} from "@src/database/reminders/ListReminders";
import {markReminderSent} from "@src/database/reminders/MarkReminderSent";
import {removeReminder} from "@src/database/reminders/RemoveReminder";
import {sendPush} from "@src/reminders/push/SendPush";
import {studyDayOf} from "@src/reminders/due/StudyDayOf";
import type {StoredReminder} from "@src/database/types/StoredReminder";

/**
 * Run each hour by the cron trigger: pushes to every device whose reminder hour it is, whose goal has not been reached today and
 * that has not been sent today's reminder. One device failing never stops the others. A device its push service says has gone is forgotten.
 */
export async function sendDueReminders(now: Date): Promise<void> {
  for (const reminder of await listReminders()) {
    if (!isReminderDue({now, ...reminder})) {
      continue;
    }

    try {
      await remind(reminder, now);
    } catch (error) {
      console.error("A reminder could not be sent.", error);
    }
  }
}

async function remind({userId, endpoint, timeZone}: StoredReminder, now: Date): Promise<void> {
  const outcome = await sendPush(endpoint, now);

  if (outcome === "sent") {
    await markReminderSent(userId, endpoint, studyDayOf(now, timeZone));
  }

  if (outcome === "gone") {
    await removeReminder(userId, endpoint);
  }
}
