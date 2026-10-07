import {keepSettingTimes} from "@src/redux/slices/settings/storage/KeepSettingTimes";
import {readSettingTimes} from "@src/redux/slices/settings/storage/ReadSettingTimes";
import {saveJson} from "@src/redux/shared/device-storage/SaveJson";
import {SETTINGS_STORAGE_KEY} from "@src/redux/slices/settings/storage/SettingsStorageKey";
import {stampChangedSettings} from "@src/redux/slices/settings/sync/StampChangedSettings";
import type {RootState} from "@src/redux/Store";
import type {Store, UnknownAction} from "@reduxjs/toolkit";

/** Writes the settings to the device each time they change, and only then, noting when each synced one was chosen (`docs/sync.md`). */
export function keepSettings(store: Store<RootState, UnknownAction>): void {
  let kept = store.getState().settings;

  store.subscribe(() => {
    const settings = store.getState().settings;

    if (settings === kept) {
      return;
    }

    keepSettingTimes(stampChangedSettings(kept, settings, readSettingTimes(), new Date()));
    kept = settings;
    saveJson(SETTINGS_STORAGE_KEY, settings);
  });
}
