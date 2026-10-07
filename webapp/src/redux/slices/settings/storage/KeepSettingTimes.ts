import {saveJson} from "@src/redux/shared/device-storage/SaveJson";
import {SETTING_TIMES_STORAGE_KEY} from "@src/redux/slices/settings/storage/SettingTimesStorageKey";
import type {SettingTimes} from "@src/redux/slices/settings/sync/types/SettingTimes";

/** Remembers when each synced setting was last chosen. */
export function keepSettingTimes(times: SettingTimes): void {
  saveJson(SETTING_TIMES_STORAGE_KEY, times);
}
