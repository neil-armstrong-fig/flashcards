import {apiRequest} from "@src/redux/api/ApiRequest";
import {okJson} from "@src/redux/api/OkJson";

/** The public key pushes from the API are signed with, which a push service wants when a device subscribes (`GET /api/reminders/key`). */
export async function readPushKey(): Promise<string> {
  const body: unknown = await okJson(await apiRequest("/api/reminders/key"));

  if (typeof body !== "object" || body === null || !("key" in body) || typeof body.key !== "string") {
    throw new Error("The API did not give its push key.");
  }

  return body.key;
}
