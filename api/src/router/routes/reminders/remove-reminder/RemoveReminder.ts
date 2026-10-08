import {endpointFrom} from "@src/router/routes/reminders/shared/utils/EndpointFrom";
import {removeReminder} from "@src/database/reminders/RemoveReminder";
import {respondEmpty} from "@src/router/respond/RespondEmpty";
import type {Account} from "@src/database/types/Account";

/** `DELETE /api/reminders/subscription` with `{endpoint}`: stop reminding that device. A device that was not being reminded is no error. */
export async function removeAccountReminder(request: Request, account: Account): Promise<Response> {
  const endpoint = endpointFrom(await request.json().catch(() => undefined));

  if (endpoint === undefined) {
    return respondEmpty(400);
  }

  await removeReminder(account.id, endpoint);

  return respondEmpty(204);
}
