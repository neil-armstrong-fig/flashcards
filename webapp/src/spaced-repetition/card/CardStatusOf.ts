import {isAvailable} from "@src/spaced-repetition/queue/timing/IsAvailable";
import {studyDayEnd} from "@src/spaced-repetition/day/StudyDayEnd";
import type {CardState} from "@src/spaced-repetition/card/types/CardState";
import type {CardStatus} from "@src/spaced-repetition/card/types/CardStatus";

/**
 * Where a card is, for showing: put away (suspended, or buried until a later study day), never answered, on its learning steps, due
 * by the end of the study day (so it will be in today's session), or waiting for a later day. Put away outranks everything, since
 * that is what decides whether it comes up at all; a review is "due" by the same rule `CardsDueToday` uses, the end of the study day.
 */
export function cardStatusOf(state: CardState, now: Date): CardStatus {
  if (state.suspended) {
    return {kind: "suspended"};
  }

  if (!isAvailable({id: "", state}, now)) {
    return {kind: "buried"};
  }

  if (state.phase === "new") {
    return {kind: "new"};
  }

  if (state.phase === "learning" || state.phase === "relearning") {
    return {kind: "learning"};
  }

  const due = new Date(state.due).getTime();

  if (due < studyDayEnd(now).getTime()) {
    return {kind: "due"};
  }

  return {kind: "scheduled", dueInMs: due - now.getTime()};
}
