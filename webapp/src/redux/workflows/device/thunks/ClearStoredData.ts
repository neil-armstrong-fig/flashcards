import {clearAllStoredData} from "@src/storage/clear-all/ClearAllStoredData";
import type {AppThunk} from "@src/redux/shared/AppThunk";

/**
 * Removes everything the app keeps on this device: progress, the learner's own cards, settings and pictures. The store still holds
 * it, so the page reloads afterwards (`react/audio/clear-device/`). What has already been synced is fetched again; what has not is lost.
 */
export function clearStoredData(): AppThunk<Promise<void>> {
  return async () => {
    await clearAllStoredData();
  };
}
