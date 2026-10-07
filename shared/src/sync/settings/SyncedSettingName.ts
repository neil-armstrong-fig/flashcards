/**
 * The settings that follow the learner to every device. Theme, voice, speed and each deck's own choices are left out on purpose: a
 * phone may want a different voice from a laptop (`docs/sync.md`). A setting is synced whole: a deck's limits are one setting.
 */
export const SYNCED_SETTING_NAMES = [
  "dailyGoalCards",
  "deckLimits",
  "strugglingAfter",
  "setAsideWhenStruggling",
  "desiredRetentionPercent",
] as const;

export type SyncedSettingName = (typeof SYNCED_SETTING_NAMES)[number];
