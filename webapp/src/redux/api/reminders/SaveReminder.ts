import {apiRequest} from "@src/redux/api/ApiRequest";
import {okJson} from "@src/redux/api/OkJson";
import type {ReminderRequest} from "@src/redux/api/reminders/types/ReminderRequest";

/** Tells the API where to push this device, and at what hour of the learner's day (`PUT /api/reminders/subscription`). Sending it again moves the hour. */
export async function saveReminder(reminder: ReminderRequest): Promise<void> {
  await okJson(
    await apiRequest("/api/reminders/subscription", {
      method: "PUT",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(reminder),
    }),
  );
}
