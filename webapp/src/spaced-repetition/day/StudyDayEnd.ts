import {DAY_ROLLOVER_HOUR} from "@src/spaced-repetition/day/DayRolloverHour";

/** The moment the study day `now` falls in ends and the next one begins. */
export function studyDayEnd(now: Date, rolloverHour: number = DAY_ROLLOVER_HOUR): Date {
  const rolloverToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), rolloverHour);

  if (now.getTime() < rolloverToday.getTime()) {
    return rolloverToday;
  }

  return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, rolloverHour);
}
