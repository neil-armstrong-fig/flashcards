import {newReminderFrom} from "@src/router/routes/reminders/shared/utils/NewReminderFrom";
import {respondEmpty} from "@src/router/respond/RespondEmpty";
import {saveReminder} from "@src/database/reminders/SaveReminder";
import type {Account} from "@src/database/types/Account";

/** `PUT /api/reminders/subscription` with `{endpoint, hour, timeZone}`: remind this device at that hour of the learner's day. Sent again, it moves the hour. */
export async function keepReminder(request: Request, account: Account): Promise<Response> {
  const reminder = newReminderFrom(await request.json().catch(() => undefined));

  if (reminder === undefined) {
    return respondEmpty(400);
  }

  await saveReminder(account.id, reminder);

  return respondEmpty(204);
}
