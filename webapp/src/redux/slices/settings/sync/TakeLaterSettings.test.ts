import {takeLaterSettings} from "@src/redux/slices/settings/sync/TakeLaterSettings";

const EARLY = "2026-10-05T10:00:00.000Z";
const LATE = "2026-10-05T11:00:00.000Z";

it("takes a choice for a setting never chosen here", () => {
  expect(takeLaterSettings([{name: "dailyGoalCards", value: 45, at: EARLY}], {})).toEqual({
    chosen: {dailyGoalCards: 45},
    times: {dailyGoalCards: EARLY},
  });
});

it("takes a later choice and keeps its time, and leaves an earlier one", () => {
  const here = {dailyGoalCards: LATE, strugglingAfter: LATE};
  const taken = takeLaterSettings(
    [
      {name: "dailyGoalCards", value: 45, at: EARLY},
      {name: "strugglingAfter", value: 3, at: "2026-10-05T12:00:00.000Z"},
    ],
    here,
  );

  expect(taken.chosen).toEqual({strugglingAfter: 3});
  expect(taken.times).toEqual({dailyGoalCards: LATE, strugglingAfter: "2026-10-05T12:00:00.000Z"});
});

it("reads the value as a setting kept on the device is read, so one out of range is clamped", () => {
  expect(takeLaterSettings([{name: "dailyGoalCards", value: 1_000_000, at: EARLY}], {}).chosen).toEqual({
    dailyGoalCards: expect.any(Number) as number,
  });
  expect(
    takeLaterSettings([{name: "dailyGoalCards", value: 1_000_000, at: EARLY}], {}).chosen.dailyGoalCards,
  ).toBeLessThan(1_000_000);
});
