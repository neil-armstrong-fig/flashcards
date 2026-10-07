import {SYNCED_SETTING_NAMES} from "@flashcards/shared/sync/settings/SyncedSettingName";
import type {SettingsState} from "@src/redux/slices/settings/types/SettingsState";
import type {SettingTimes} from "@src/redux/slices/settings/sync/types/SettingTimes";

/** The times with `now` written against every synced setting that differs between `before` and `after`, which is how a choice is noticed. */
export function stampChangedSettings(
  before: SettingsState,
  after: SettingsState,
  times: SettingTimes,
  now: Date,
): SettingTimes {
  const stamped: Partial<Record<string, string>> = {...times};

  for (const name of SYNCED_SETTING_NAMES) {
    if (before[name] !== after[name]) {
      stamped[name] = now.toISOString();
    }
  }

  return stamped;
}
