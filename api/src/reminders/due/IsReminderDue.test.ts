import {isReminderDue} from "@src/reminders/due/IsReminderDue";

const EIGHT_IN_LONDON = new Date("2026-10-01T19:00:00Z");

it("is due at the chosen hour in the learner's own time", () => {
  expect(isReminderDue({now: EIGHT_IN_LONDON, hour: 20, timeZone: "Europe/London"})).toBe(true);
});

it("is not due at any other hour", () => {
  expect(isReminderDue({now: EIGHT_IN_LONDON, hour: 21, timeZone: "Europe/London"})).toBe(false);
});

it("reads the hour in the learner's time zone, not the server's", () => {
  expect(isReminderDue({now: EIGHT_IN_LONDON, hour: 20, timeZone: "Asia/Seoul"})).toBe(false);
  expect(isReminderDue({now: EIGHT_IN_LONDON, hour: 4, timeZone: "Asia/Seoul"})).toBe(true);
});

it("is not due once the goal was reached today", () => {
  expect(isReminderDue({now: EIGHT_IN_LONDON, hour: 20, timeZone: "Europe/London", goalMetOn: "2026-10-01"})).toBe(
    false,
  );
});

it("is due when the goal was only reached on an earlier day", () => {
  expect(isReminderDue({now: EIGHT_IN_LONDON, hour: 20, timeZone: "Europe/London", goalMetOn: "2026-09-30"})).toBe(
    true,
  );
});

it("is not due twice for one study day", () => {
  expect(isReminderDue({now: EIGHT_IN_LONDON, hour: 20, timeZone: "Europe/London", lastSentOn: "2026-10-01"})).toBe(
    false,
  );
});

it("is due again the next study day", () => {
  expect(isReminderDue({now: EIGHT_IN_LONDON, hour: 20, timeZone: "Europe/London", lastSentOn: "2026-09-30"})).toBe(
    true,
  );
});

it("counts a small-hours reminder as belonging to the day before", () => {
  const twoInTheMorning = new Date("2026-10-02T01:00:00Z");

  expect(isReminderDue({now: twoInTheMorning, hour: 2, timeZone: "Europe/London", goalMetOn: "2026-10-01"})).toBe(
    false,
  );
});
