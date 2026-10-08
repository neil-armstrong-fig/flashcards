import {readJson} from "@src/storage/local-storage/device/ReadJson";
import {SETTINGS_STORAGE_KEY} from "@src/storage/local-storage/settings/SettingsStorageKey";

/** The settings kept on this device, as `unknown` until the settings have checked them. */
export function readStoredSettings(): unknown {
  return readJson(SETTINGS_STORAGE_KEY);
}
