import {vapidAuthorization} from "@src/reminders/vapid/VapidAuthorization";
import {workerEnvironment} from "@src/env/WorkerEnvironment";

/** How a push went: `sent`, `gone` (the device or its browser has dropped the subscription, so never send there again) or `failed` (try again another day). */
export type PushOutcome = "sent" | "gone" | "failed";

/** An hour: a reminder not delivered by then is no use, so the push service may drop it. */
const TIME_TO_LIVE_IN_SECONDS = "3600";

/**
 * Pushes to a device with no message in it: the app's worker says what to show (`docs/reminders.md`). Reads the keys at the point of use,
 * and throws where the Worker has none, so a Worker without them reminds nobody and everything else carries on.
 */
export async function sendPush(endpoint: string, now: Date): Promise<PushOutcome> {
  const {VAPID_PUBLIC_KEY: publicKey, VAPID_PRIVATE_KEY: privateKey, VAPID_SUBJECT: subject} = workerEnvironment;

  if (!publicKey || !privateKey || !subject) {
    throw new Error("The reminders' VAPID keys are not set.");
  }

  const authorization = await vapidAuthorization({endpoint, publicKey, privateKey, subject, now});
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {Authorization: authorization, TTL: TIME_TO_LIVE_IN_SECONDS, Urgency: "normal"},
  });

  if (response.ok) {
    return "sent";
  }

  if (response.status === 404 || response.status === 410) {
    return "gone";
  }

  console.error(`A push service answered ${response.status} to a reminder.`);

  return "failed";
}
