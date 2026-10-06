import {DEFAULT_DECK_LIMITS} from "@src/redux/slices/settings/limits/DefaultDeckLimits";
import type {QueueSettings} from "@src/spaced-repetition/queue/types/QueueSettings";
import type {SettingsState} from "@src/redux/slices/settings/types/SettingsState";

/** The default: a learning card up to twenty minutes away may be shown early when nothing else is waiting. */
const LEARN_AHEAD_MINUTES = 20;

/** What shapes today's study of one deck, from the limits the learner chose for it. */
export function queueSettingsOf(settings: SettingsState, deckId: string): QueueSettings {
  const {newCardsPerDay, maxReviewsPerDay} = settings.deckLimits[deckId] ?? DEFAULT_DECK_LIMITS;

  return {newCardsPerDay, maxReviewsPerDay, learnAheadMinutes: LEARN_AHEAD_MINUTES};
}
