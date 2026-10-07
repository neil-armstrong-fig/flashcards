import type {SyncedSettingName} from "@flashcards/shared/sync/settings/SyncedSettingName";

/** When the learner last chose each synced setting on this device or heard of a choice from another, as ISO timestamps. A setting never chosen has none. */
export type SettingTimes = Readonly<Partial<Record<SyncedSettingName, string>>>;
