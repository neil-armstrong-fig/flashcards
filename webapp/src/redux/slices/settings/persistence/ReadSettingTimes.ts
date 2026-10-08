import {readStoredSettingTimes} from "@src/storage/local-storage/setting-times/ReadStoredSettingTimes";
import {SYNCED_SETTING_NAMES} from "@flashcards/shared/sync/settings/SyncedSettingName";
import type {SettingTimes} from "@src/redux/slices/settings/sync/types/SettingTimes";

/** When each synced setting was last chosen, as kept on this device. What is stored is untrusted: a time that is not one is dropped. */
export function readSettingTimes(): SettingTimes {
  const stored = readStoredSettingTimes();

  if (typeof stored !== "object" || stored === null) {
    return {};
  }

  const times: Partial<Record<string, string>> = {};

  for (const name of SYNCED_SETTING_NAMES) {
    const at = (stored as Record<string, unknown>)[name];

    if (typeof at === "string" && !Number.isNaN(new Date(at).getTime())) {
      times[name] = at;
    }
  }

  return times;
}
