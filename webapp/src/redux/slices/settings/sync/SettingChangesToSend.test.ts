import {INITIAL_SETTINGS_STATE} from "@src/redux/slices/settings/initial-state/InitialSettingsState";
import {settingChangesToSend} from "@src/redux/slices/settings/sync/SettingChangesToSend";

it("sends the settings that have been chosen, with their values and times, and nothing else", () => {
  const settings = {...INITIAL_SETTINGS_STATE, dailyGoalCards: 45, theme: "dark" as const};
  const times = {dailyGoalCards: "2026-10-05T10:00:00.000Z"};

  expect(settingChangesToSend(settings, times)).toEqual([
    {name: "dailyGoalCards", value: 45, at: "2026-10-05T10:00:00.000Z"},
  ]);
});

it("sends nothing from a device where nothing has been chosen", () => {
  expect(settingChangesToSend(INITIAL_SETTINGS_STATE, {})).toEqual([]);
});
