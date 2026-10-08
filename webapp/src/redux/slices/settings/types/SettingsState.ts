import type {DeckPreferences} from "@src/redux/slices/settings/types/DeckPreferences";
import type {DeckLimits} from "@src/redux/slices/settings/types/DeckLimits";
import type {Speed} from "@flashcards/shared/audio/Speed";
import type {Theme} from "@flashcards/shared/theme/Theme";
import type {Voice} from "@flashcards/shared/audio/Voice";

export interface SettingsState {
  /** How many cards the learner aims to review each day. */
  readonly dailyGoalCards: number;
  /** The daily limits of each deck, by deck id. A deck with none kept has the defaults. */
  readonly deckLimits: Readonly<Record<string, DeckLimits>>;
  /** How each deck is heard and shown, by deck id. A deck with none kept has the defaults. */
  readonly deckPreferences: Readonly<Record<string, DeckPreferences>>;
  /** Which speaker is played where no deck is being studied, as when browsing every card. */
  readonly voice: Voice;
  /** How fast it speaks, where no deck is being studied. */
  readonly speed: Speed;
  /** How many times a card must be forgotten (a lapse) before it counts as struggling. */
  readonly strugglingAfter: number;
  /** Suspend a card the moment it counts as struggling, rather than leaving it in the reviews. */
  readonly setAsideWhenStruggling: boolean;
  /** The percentage of reviewed cards the learner wants to still remember when they come back: higher means more reviews. */
  readonly desiredRetentionPercent: number;
  /** Whether this device is sent a reminder when the daily goal is not yet reached. Kept per device: a push subscription belongs to one. */
  readonly reminderEnabled: boolean;
  /** The hour of the day, 0 to 23, the reminder comes at. */
  readonly reminderHour: number;
  /** The colours: one of the two palettes, or whichever the device asks for. */
  readonly theme: Theme;
}
