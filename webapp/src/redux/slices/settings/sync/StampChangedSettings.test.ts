import {INITIAL_SETTINGS_STATE} from "@src/redux/slices/settings/initial-state/InitialSettingsState";
import {stampChangedSettings} from "@src/redux/slices/settings/sync/StampChangedSettings";

const now = new Date("2026-10-05T10:00:00.000Z");

it("stamps a synced setting that changed, and leaves the others alone", () => {
  const times = {strugglingAfter: "2026-10-01T10:00:00.000Z"};
  const after = {...INITIAL_SETTINGS_STATE, dailyGoalCards: 45};

  expect(stampChangedSettings(INITIAL_SETTINGS_STATE, after, times, now)).toEqual({
    strugglingAfter: "2026-10-01T10:00:00.000Z",
    dailyGoalCards: now.toISOString(),
  });
});

it("does not stamp a setting that stays on the device", () => {
  const after = {...INITIAL_SETTINGS_STATE, theme: "dark" as const, voice: "male" as const};

  expect(stampChangedSettings(INITIAL_SETTINGS_STATE, after, {}, now)).toEqual({});
});
