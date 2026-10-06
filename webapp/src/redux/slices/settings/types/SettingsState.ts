import type {DeckLimits} from "@src/redux/slices/settings/types/DeckLimits";
import type {Speed} from "@flashcards/shared/audio/Speed";
import type {Theme} from "@flashcards/shared/theme/Theme";
import type {Voice} from "@flashcards/shared/audio/Voice";

export interface SettingsState {
  /** How many cards the learner aims to review each day. */
  readonly dailyGoalCards: number;
  /** The daily limits of each deck, by deck id. A deck with none kept has the defaults. */
  readonly deckLimits: Readonly<Record<string, DeckLimits>>;
  /** Which speaker is played. */
  readonly voice: Voice;
  /** How fast it speaks. */
  readonly speed: Speed;
  /** How many times a card must be forgotten (a lapse) before it counts as struggling. */
  readonly strugglingAfter: number;
  /** Suspend a card the moment it counts as struggling, rather than leaving it in the reviews. */
  readonly setAsideWhenStruggling: boolean;
  /** The percentage of reviewed cards the learner wants to still remember when they come back: higher means more reviews. */
  readonly desiredRetentionPercent: number;
  /** The colours: one of the two palettes, or whichever the device asks for. */
  readonly theme: Theme;
  /** Keep the target-language word off the front of the card, so the learner has to listen. */
  readonly listenOnly: boolean;
}
