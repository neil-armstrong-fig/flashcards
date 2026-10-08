import {apiRequest} from "@src/redux/api/ApiRequest";
import {okJson} from "@src/redux/api/OkJson";

/** Tells the API the daily goal was reached on a study day (`YYYY-MM-DD`), so no device is reminded that day (`POST /api/reminders/goal-met`). */
export async function reportGoalMet(studyDay: string): Promise<void> {
  await okJson(
    await apiRequest("/api/reminders/goal-met", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({studyDay}),
    }),
  );
}
