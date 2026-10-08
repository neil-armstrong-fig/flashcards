import {readJson} from "@src/storage/local-storage/device/ReadJson";
import {SETTING_TIMES_STORAGE_KEY} from "@src/storage/local-storage/setting-times/SettingTimesStorageKey";

/** When each synced setting was last chosen, as kept on this device and as `unknown` until the settings have checked it. */
export function readStoredSettingTimes(): unknown {
  return readJson(SETTING_TIMES_STORAGE_KEY);
}
