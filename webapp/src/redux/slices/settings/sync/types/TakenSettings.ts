import type {SettingsState} from "@src/redux/slices/settings/types/SettingsState";
import type {SettingTimes} from "@src/redux/slices/settings/sync/types/SettingTimes";
import type {SyncedSettingName} from "@flashcards/shared/sync/settings/SyncedSettingName";

/** The choices from another device that are later than this one's: each setting with its value, and the times to keep for them. */
export interface TakenSettings {
  readonly chosen: Readonly<Partial<Pick<SettingsState, SyncedSettingName>>>;
  readonly times: SettingTimes;
}
