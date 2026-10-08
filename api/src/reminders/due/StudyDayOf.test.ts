import {studyDayOf} from "@src/reminders/due/StudyDayOf";

it.each([
  ["London, mid-evening", "2026-10-01T19:00:00Z", "Europe/London", "2026-10-01"],
  ["London, half past two in the morning, still the day before", "2026-10-02T01:30:00Z", "Europe/London", "2026-10-01"],
  ["London, five in the morning, the new day", "2026-10-02T04:00:00Z", "Europe/London", "2026-10-02"],
  ["Seoul, where it is already the next calendar day", "2026-10-01T20:00:00Z", "Asia/Seoul", "2026-10-02"],
  ["Seoul, three in the morning", "2026-10-01T18:00:00Z", "Asia/Seoul", "2026-10-01"],
])("puts %s on the right study day", (_name, moment, timeZone, expected) => {
  expect(studyDayOf(new Date(moment), timeZone)).toBe(expected);
});
