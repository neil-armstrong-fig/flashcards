import type {Speed} from "@flashcards/shared/audio/Speed";
import type {Voice} from "@flashcards/shared/audio/Voice";

/** How one deck is heard and shown while it is studied. A voice that sounds odd on one deck can be changed for that deck alone. */
export interface DeckPreferences {
  /** Which speaker is played for the deck's target language. */
  readonly voice: Voice;
  /** How fast it speaks. */
  readonly speed: Speed;
  /** Keep the target-language word off the front of the card, so the learner has to listen. */
  readonly hideTarget: boolean;
}
