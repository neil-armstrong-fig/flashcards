import {SYNCED_SETTING_NAMES} from "@flashcards/shared/sync/settings/SyncedSettingName";
import type {SettingChange} from "@flashcards/shared/sync/settings/SettingChange";
import type {SettingsState} from "@src/redux/slices/settings/types/SettingsState";
import type {SettingTimes} from "@src/redux/slices/settings/sync/types/SettingTimes";

/** The synced settings the learner has chosen on this device, with when. A setting never chosen is left for another device's choice to fill. */
export function settingChangesToSend(settings: SettingsState, times: SettingTimes): SettingChange[] {
  return SYNCED_SETTING_NAMES.flatMap(name => {
    const at = times[name];

    if (at === undefined) {
      return [];
    }

    return [{name, value: settings[name], at}];
  });
}
