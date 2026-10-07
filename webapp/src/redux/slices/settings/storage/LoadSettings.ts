import {readJson} from "@src/redux/shared/device-storage/ReadJson";
import {readSettings} from "@src/redux/slices/settings/storage/read/ReadSettings";
import {SETTINGS_STORAGE_KEY} from "@src/redux/slices/settings/storage/SettingsStorageKey";
import type {SettingsState} from "@src/redux/slices/settings/types/SettingsState";

/** The settings kept on this device. */
export function loadSettings(): SettingsState {
  return readSettings(readJson(SETTINGS_STORAGE_KEY));
}
