import {studyDayEnd} from "@src/spaced-repetition/day/StudyDayEnd";

it("ends an afternoon's study day at four the next morning", () => {
  expect(studyDayEnd(new Date(2026, 9, 5, 15, 0))).toEqual(new Date(2026, 9, 6, 4, 0));
});

it("ends a small-hours study day at four that same morning", () => {
  expect(studyDayEnd(new Date(2026, 9, 6, 1, 0))).toEqual(new Date(2026, 9, 6, 4, 0));
});

it("crosses a month end", () => {
  expect(studyDayEnd(new Date(2026, 9, 31, 12, 0))).toEqual(new Date(2026, 10, 1, 4, 0));
});
