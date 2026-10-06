import {byDueTime} from "@src/spaced-repetition/queue/timing/ByDueTime";
import {cardsDueToday} from "@src/spaced-repetition/queue/due/CardsDueToday";
import {heldBackCards} from "@src/spaced-repetition/queue/siblings/HeldBackCards";
import {dueTime} from "@src/spaced-repetition/queue/timing/DueTime";
import {isBeingLearned} from "@src/spaced-repetition/queue/timing/IsBeingLearned";
import type {QueueSettings} from "@src/spaced-repetition/queue/types/QueueSettings";
import type {ReviewLogEntry} from "@src/spaced-repetition/scheduling/types/ReviewLogEntry";
import type {StudyCard} from "@src/spaced-repetition/card/types/StudyCard";

const MINUTE_IN_MS = 60 * 1000;

/**
 * The card to show now, or `undefined` when today's work is done.
 *
 * Learning cards whose wait is over come first, then reviews, then new cards. When nothing else is left, a learning card
 * that is only minutes away is shown early ("learn ahead") rather than ending the session with it still
 * waiting. A card whose sibling was answered today is held back until nothing else is left to show.
 */
export function nextCard(
  cards: readonly StudyCard[],
  log: readonly ReviewLogEntry[],
  now: Date,
  settings: QueueSettings,
): StudyCard | undefined {
  const today = cardsDueToday(cards, log, now, settings);
  const heldBack = new Set(heldBackCards(today, log, now));
  const apart = today.filter(card => !heldBack.has(card));

  return firstOf(apart, now, settings) ?? firstOf(today, now, settings);
}

function firstOf(today: readonly StudyCard[], now: Date, settings: QueueSettings): StudyCard | undefined {
  const learnAheadUntil = now.getTime() + settings.learnAheadMinutes * MINUTE_IN_MS;

  const learningNow = today.filter(card => isBeingLearned(card) && dueTime(card) <= now.getTime()).sort(byDueTime);
  const reviews = today.filter(card => card.state.phase === "review");
  const brandNew = today.filter(card => card.state.phase === "new");
  const learningSoon = today.filter(card => isBeingLearned(card) && dueTime(card) <= learnAheadUntil).sort(byDueTime);

  return learningNow[0] ?? reviews[0] ?? brandNew[0] ?? learningSoon[0];
}
