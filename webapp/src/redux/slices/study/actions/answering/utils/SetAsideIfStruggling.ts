import {isStruggling} from "@src/spaced-repetition/card/IsStruggling";
import {suspendCard} from "@src/spaced-repetition/card/setting-aside/SuspendCard";
import type {ReviewOutcome} from "@src/spaced-repetition/scheduling/types/ReviewOutcome";
import type {SettingsState} from "@src/redux/slices/settings/types/SettingsState";
import type {StudyCard} from "@src/spaced-repetition/card/types/StudyCard";

/**
 * A card that has just been forgotten and now counts as struggling is suspended, when the learner chose that. Only a lapse does
 * it: the answer that made it struggle is a forgetting, so no earlier answers can have cleared it, and a card the learner has
 * brought back is not set aside again until it is forgotten again.
 */
export function setAsideIfStruggling(
  outcome: ReviewOutcome,
  previous: StudyCard,
  settings: SettingsState,
): ReviewOutcome {
  const forgotten = outcome.state.lapses > previous.state.lapses;

  if (
    !settings.setAsideWhenStruggling ||
    !forgotten ||
    !isStruggling(outcome.state, [outcome.log], settings.strugglingAfter)
  ) {
    return outcome;
  }

  return {...outcome, state: suspendCard(outcome.state)};
}
