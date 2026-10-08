import {studyDayOf} from "@src/reminders/due/StudyDayOf";

interface Props {
  readonly now: Date;
  /** The hour of the day, 0 to 23, the learner chose. */
  readonly hour: number;
  readonly timeZone: string;
  /** The study day the device last said the goal was reached on. */
  readonly goalMetOn?: string;
  /** The study day a reminder was last sent for. */
  readonly lastSentOn?: string;
}

/** Whether a reminder should be sent now: it is the learner's chosen hour, and neither the goal nor an earlier reminder has covered today. */
export function isReminderDue({now, hour, timeZone, goalMetOn, lastSentOn}: Props): boolean {
  if (localHourOf(now, timeZone) !== hour) {
    return false;
  }

  const today = studyDayOf(now, timeZone);

  return goalMetOn !== today && lastSentOn !== today;
}

function localHourOf(now: Date, timeZone: string): number {
  const hour = new Intl.DateTimeFormat("en-GB", {timeZone, hour: "2-digit", hourCycle: "h23"}).format(now);

  return Number(hour);
}
