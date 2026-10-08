import {respondEmpty} from "@src/router/respond/RespondEmpty";
import {respondJson} from "@src/router/respond/RespondJson";
import {workerEnvironment} from "@src/env/WorkerEnvironment";

/** `GET /api/reminders/key`: the public key the pushes are signed with, which a device subscribes to the push service with. 503 where the Worker has none, so reminders are off. */
export function readPushKey(): Response {
  const key = workerEnvironment.VAPID_PUBLIC_KEY;

  if (!key) {
    return respondEmpty(503);
  }

  return respondJson({key});
}
