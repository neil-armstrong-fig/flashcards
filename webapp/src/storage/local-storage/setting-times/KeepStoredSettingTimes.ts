import {saveJson} from "@src/storage/local-storage/device/SaveJson";
import {SETTING_TIMES_STORAGE_KEY} from "@src/storage/local-storage/setting-times/SettingTimesStorageKey";

/** Keeps when each synced setting was last chosen on this device. */
export function keepStoredSettingTimes(times: unknown): void {
  saveJson(SETTING_TIMES_STORAGE_KEY, times);
}
