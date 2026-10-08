import {keepStoredSettingTimes} from "@src/storage/local-storage/setting-times/KeepStoredSettingTimes";
import type {SettingTimes} from "@src/redux/slices/settings/sync/types/SettingTimes";

/** Remembers when each synced setting was last chosen. */
export function keepSettingTimes(times: SettingTimes): void {
  keepStoredSettingTimes(times);
}
