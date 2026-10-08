import {isPushEndpoint} from "@src/router/routes/reminders/shared/utils/IsPushEndpoint";
import type {NewReminder} from "@src/database/types/NewReminder";

/** What a device sent to be reminded, if it is a push address over https, an hour of the day and a time zone that exists; otherwise nothing. */
export function newReminderFrom(body: unknown): NewReminder | undefined {
  if (typeof body !== "object" || body === null) {
    return undefined;
  }

  const {endpoint, hour, timeZone} = body as Record<string, unknown>;

  if (!isPushEndpoint(endpoint) || !isHour(hour) || !isTimeZone(timeZone)) {
    return undefined;
  }

  return {endpoint, hour, timeZone};
}

function isHour(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= 23;
}

function isTimeZone(value: unknown): value is string {
  if (typeof value !== "string") {
    return false;
  }

  try {
    new Intl.DateTimeFormat("en-GB", {timeZone: value});

    return true;
  } catch {
    return false;
  }
}
