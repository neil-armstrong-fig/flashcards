import {readStoredSettings} from "@src/storage/local-storage/settings/ReadStoredSettings";
import {readSettings} from "@src/redux/slices/settings/persistence/read/ReadSettings";
import type {SettingsState} from "@src/redux/slices/settings/types/SettingsState";

/** The settings kept on this device. */
export function loadSettings(audioFillEnabledByDefault = false): SettingsState {
  return readSettings(readStoredSettings(), audioFillEnabledByDefault);
}
