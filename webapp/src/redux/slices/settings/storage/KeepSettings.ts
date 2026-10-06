import {saveJson} from "@src/redux/shared/device-storage/SaveJson";
import {SETTINGS_STORAGE_KEY} from "@src/redux/slices/settings/storage/SettingsStorageKey";
import type {RootState} from "@src/redux/Store";
import type {Store, UnknownAction} from "@reduxjs/toolkit";

/** Writes the settings to the device each time they change, and only then. */
export function keepSettings(store: Store<RootState, UnknownAction>): void {
  let kept = store.getState().settings;

  store.subscribe(() => {
    const settings = store.getState().settings;

    if (settings === kept) {
      return;
    }

    kept = settings;
    saveJson(SETTINGS_STORAGE_KEY, settings);
  });
}
