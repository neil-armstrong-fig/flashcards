import {
  DAILY_GOAL_CARDS_LIMITS,
  DESIRED_RETENTION_PERCENT_LIMITS,
  REMINDER_HOUR_LIMITS,
  STRUGGLING_AFTER_LIMITS,
} from "@src/redux/slices/settings/limits/SettingLimits";
import {INITIAL_SETTINGS_STATE} from "@src/redux/slices/settings/initial-state/InitialSettingsState";
import {readLimitedInteger} from "@src/redux/slices/settings/limits/ReadLimitedInteger";
import {readDeckPreferences} from "@src/redux/slices/settings/persistence/read/ReadDeckPreferences";
import {readDeckLimits} from "@src/redux/slices/settings/persistence/read/ReadDeckLimits";
import {readBoolean} from "@src/redux/slices/settings/persistence/read/ReadBoolean";
import {readOneOf} from "@src/redux/slices/settings/persistence/read/ReadOneOf";
import {SPEEDS} from "@flashcards/shared/audio/Speed";
import {THEMES} from "@flashcards/shared/theme/Theme";
import {VOICES} from "@flashcards/shared/audio/Voice";
import type {SettingsState} from "@src/redux/slices/settings/types/SettingsState";

/** Settings from something stored or received. What arrives is untrusted: a field that does not check out falls back to its default alone. */
export function readSettings(stored: unknown, audioFillEnabledByDefault = false): SettingsState {
  if (typeof stored !== "object" || stored === null) {
    return {...INITIAL_SETTINGS_STATE, audioFillEnabled: audioFillEnabledByDefault};
  }

  const {
    dailyGoalCards,
    deckLimits,
    deckPreferences,
    desiredRetentionPercent,
    strugglingAfter,
    setAsideWhenStruggling,
    voice,
    speed,
    audioFillEnabled,
    listenOnly,
    reminderEnabled,
    reminderHour,
    theme,
  } = stored as Record<string, unknown>;

  return {
    dailyGoalCards:
      readLimitedInteger(dailyGoalCards, DAILY_GOAL_CARDS_LIMITS) ?? INITIAL_SETTINGS_STATE.dailyGoalCards,
    deckLimits: readDeckLimits(deckLimits),
    deckPreferences: readDeckPreferences(deckPreferences, {
      voice: readOneOf(voice, VOICES),
      speed: readOneOf(speed, SPEEDS),
      hideTarget: readBoolean(listenOnly),
    }),
    desiredRetentionPercent:
      readLimitedInteger(desiredRetentionPercent, DESIRED_RETENTION_PERCENT_LIMITS) ??
      INITIAL_SETTINGS_STATE.desiredRetentionPercent,
    strugglingAfter:
      readLimitedInteger(strugglingAfter, STRUGGLING_AFTER_LIMITS) ?? INITIAL_SETTINGS_STATE.strugglingAfter,
    setAsideWhenStruggling: readBoolean(setAsideWhenStruggling) ?? INITIAL_SETTINGS_STATE.setAsideWhenStruggling,
    voice: readOneOf(voice, VOICES) ?? INITIAL_SETTINGS_STATE.voice,
    speed: readOneOf(speed, SPEEDS) ?? INITIAL_SETTINGS_STATE.speed,
    audioFillEnabled: readBoolean(audioFillEnabled) ?? audioFillEnabledByDefault,
    reminderEnabled: readBoolean(reminderEnabled) ?? INITIAL_SETTINGS_STATE.reminderEnabled,
    reminderHour: readLimitedInteger(reminderHour, REMINDER_HOUR_LIMITS) ?? INITIAL_SETTINGS_STATE.reminderHour,
    theme: readOneOf(theme, THEMES) ?? INITIAL_SETTINGS_STATE.theme,
  };
}
