import {saveJson} from "@src/storage/local-storage/device/SaveJson";
import {SETTINGS_STORAGE_KEY} from "@src/storage/local-storage/settings/SettingsStorageKey";

/** Keeps the settings on this device. */
export function keepStoredSettings(settings: unknown): void {
  saveJson(SETTINGS_STORAGE_KEY, settings);
}
