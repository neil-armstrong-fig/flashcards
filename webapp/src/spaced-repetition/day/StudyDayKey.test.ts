import {studyDayKey} from "@src/spaced-repetition/day/StudyDayKey";

it("counts the small hours as the previous study day", () => {
  expect(studyDayKey(new Date(2026, 9, 6, 2, 30))).toBe("2026-10-05");
});

it("starts a new study day at the rollover hour", () => {
  expect(studyDayKey(new Date(2026, 9, 6, 4, 0))).toBe("2026-10-06");
});
