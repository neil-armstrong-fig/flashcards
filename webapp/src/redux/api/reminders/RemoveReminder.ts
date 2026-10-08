import {apiRequest} from "@src/redux/api/ApiRequest";
import {okJson} from "@src/redux/api/OkJson";

/** Tells the API to stop pushing to a device (`DELETE /api/reminders/subscription`). */
export async function removeReminder(endpoint: string): Promise<void> {
  await okJson(
    await apiRequest("/api/reminders/subscription", {
      method: "DELETE",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({endpoint}),
    }),
  );
}
