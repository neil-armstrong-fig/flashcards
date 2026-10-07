import {readSettingChange} from "@flashcards/shared/sync/settings/SettingChange";

const at = "2026-10-05T10:00:00.000Z";

it("reads a synced setting with the moment it was chosen", () => {
  expect(readSettingChange({name: "dailyGoalCards", value: 45, at})).toEqual({name: "dailyGoalCards", value: 45, at});
});

it.each([
  ["a setting that stays on the device", {name: "theme", value: "dark", at}],
  ["no value", {name: "dailyGoalCards", at}],
  ["a bad moment", {name: "dailyGoalCards", value: 45, at: "soon"}],
  ["null", null],
])("refuses %s", (_name, value) => {
  expect(readSettingChange(value)).toBeUndefined();
});
