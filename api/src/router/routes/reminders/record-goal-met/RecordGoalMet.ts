import {recordGoalMet} from "@src/database/reminders/RecordGoalMet";
import {respondEmpty} from "@src/router/respond/RespondEmpty";
import {studyDayFrom} from "@src/router/routes/reminders/shared/utils/StudyDayFrom";
import type {Account} from "@src/database/types/Account";

/** `POST /api/reminders/goal-met` with `{studyDay}`: the learner reached the daily goal that study day, so no device is reminded on it. */
export async function recordAccountGoalMet(request: Request, account: Account): Promise<Response> {
  const studyDay = studyDayFrom(await request.json().catch(() => undefined));

  if (studyDay === undefined) {
    return respondEmpty(400);
  }

  await recordGoalMet(account.id, studyDay);

  return respondEmpty(204);
}
