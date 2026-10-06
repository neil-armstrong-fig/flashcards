import {INITIAL_SETTINGS_STATE} from "@src/redux/slices/settings/initial-state/InitialSettingsState";
import {setAsideIfStruggling} from "@src/redux/slices/study/actions/answering/utils/SetAsideIfStruggling";
import type {CardState} from "@src/spaced-repetition/card/types/CardState";
import type {ReviewOutcome} from "@src/spaced-repetition/scheduling/types/ReviewOutcome";
import type {SettingsState} from "@src/redux/slices/settings/types/SettingsState";
import type {StudyCard} from "@src/spaced-repetition/card/types/StudyCard";

const SETTINGS: SettingsState = {...INITIAL_SETTINGS_STATE, setAsideWhenStruggling: true, strugglingAfter: 2};

function stateWith(lapses: number): CardState {
  return {
    phase: "review",
    due: "2026-10-06T10:00:00.000Z",
    stability: 3,
    difficulty: 5,
    scheduledDays: 3,
    learningSteps: 0,
    reps: 5,
    lapses,
    lastReview: "2026-10-05T10:00:00.000Z",
    suspended: false,
  };
}

function outcomeWith(lapses: number): ReviewOutcome {
  return {
    state: stateWith(lapses),
    log: {
      cardId: "a",
      rating: "again",
      phaseBefore: "review",
      reviewedAt: "2026-10-05T10:00:00.000Z",
      scheduledDays: 0,
      due: "2026-10-05T10:10:00.000Z",
    },
  };
}

const BEFORE = (lapses: number): StudyCard => ({id: "a", state: stateWith(lapses)});

it("suspends a card forgotten into struggling, when the learner chose that", () => {
  expect(setAsideIfStruggling(outcomeWith(2), BEFORE(1), SETTINGS).state.suspended).toBe(true);
});

it("leaves it in the reviews unless the learner chose to set struggling cards aside", () => {
  const settings = {...SETTINGS, setAsideWhenStruggling: false};

  expect(setAsideIfStruggling(outcomeWith(2), BEFORE(1), settings).state.suspended).toBe(false);
});

it("sets aside only on a lapse: a card already struggling that is not forgotten stays where it is", () => {
  expect(setAsideIfStruggling(outcomeWith(2), BEFORE(2), SETTINGS).state.suspended).toBe(false);
});

it("leaves a forgotten card that is not yet struggling", () => {
  expect(setAsideIfStruggling(outcomeWith(1), BEFORE(0), SETTINGS).state.suspended).toBe(false);
});
