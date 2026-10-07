import {SYNCED_SETTING_NAMES} from "@flashcards/shared/sync/settings/SyncedSettingName";
import {syncAndKeepRecordings} from "@src/react/audio/sync/SyncAndKeepRecordings";
import type {SettingsState} from "@src/redux/slices/settings/types/SettingsState";
import type {AppStore} from "@src/redux/Store";

/** A few seconds after the last answer: long enough that a run of answers goes in one request. */
const QUIET_BEFORE_SYNC_MS = 4_000;

/**
 * Syncs when the app comes back to the foreground, when the browser says it is back online, and a few seconds after the learner
 * last answered, chose a setting that follows them, or made, changed or removed something of theirs. (The Background Sync API is not on iOS, so nothing relies on it.) Returns what stops all three.
 */
export function keepProgressSynced(store: AppStore): () => void {
  let timer: ReturnType<typeof setTimeout> | undefined;
  let answers = store.getState().study.log.length;
  let chosen = syncedSettingsOf(store.getState().settings);
  let made = store.getState().sync.localChanges;

  const syncNow = (): void => void syncAndKeepRecordings(store);
  const whenVisible = (): void => {
    if (document.visibilityState === "visible") {
      syncNow();
    }
  };
  const unsubscribe = store.subscribe(() => {
    const now = store.getState().study.log.length;
    const settings = syncedSettingsOf(store.getState().settings);

    const changes = store.getState().sync.localChanges;

    if (now === answers && settings === chosen && changes === made) {
      return;
    }

    answers = now;
    chosen = settings;
    made = changes;
    clearTimeout(timer);
    timer = setTimeout(syncNow, QUIET_BEFORE_SYNC_MS);
  });

  document.addEventListener("visibilitychange", whenVisible);
  window.addEventListener("online", syncNow);

  return () => {
    clearTimeout(timer);
    unsubscribe();
    document.removeEventListener("visibilitychange", whenVisible);
    window.removeEventListener("online", syncNow);
  };
}

/** What the synced settings are now, as one string, so that a change to any of them (and to none of the others) is seen as a change. */
function syncedSettingsOf(settings: SettingsState): string {
  return JSON.stringify(SYNCED_SETTING_NAMES.map(name => settings[name]));
}
