import {DAY_ROLLOVER_HOUR} from "@src/spaced-repetition/day/DayRolloverHour";

/** The date, as `YYYY-MM-DD`, of the study day `now` falls in. */
export function studyDayKey(now: Date, rolloverHour: number = DAY_ROLLOVER_HOUR): string {
  const shifted = new Date(now.getTime() - rolloverHour * 60 * 60 * 1000);
  const month = String(shifted.getMonth() + 1).padStart(2, "0");
  const day = String(shifted.getDate()).padStart(2, "0");

  return `${shifted.getFullYear()}-${month}-${day}`;
}
