import {isStruggling} from "@src/spaced-repetition/card/IsStruggling";
import type {CardState} from "@src/spaced-repetition/card/types/CardState";
import type {DeckCard} from "@language-learning/content/types/DeckCard";
import type {ReviewLogEntry} from "@src/spaced-repetition/scheduling/types/ReviewLogEntry";
import type {StrugglingRow} from "@src/redux/shared/struggling/types/StrugglingRow";

interface Input {
  readonly cards: readonly DeckCard[];
  readonly states: Readonly<Record<string, CardState>>;
  readonly log: readonly ReviewLogEntry[];
  readonly threshold: number;
}

/** The cards the learner keeps forgetting, in deck order. Suspended ones are included: setting a card aside does not make it better. */
export function strugglingRowsOf({cards, states, log, threshold}: Input): StrugglingRow[] {
  const answersOf = answersByCard(log);
  const rows: StrugglingRow[] = [];

  for (const card of cards) {
    const state = states[card.id];

    if (!state || !isStruggling(state, answersOf.get(card.id) ?? [], threshold)) {
      continue;
    }

    rows.push({id: card.id, front: card.front, back: card.back, lapses: state.lapses, suspended: state.suspended});
  }

  return rows;
}

function answersByCard(log: readonly ReviewLogEntry[]): Map<string, ReviewLogEntry[]> {
  const answers = new Map<string, ReviewLogEntry[]>();

  for (const entry of log) {
    const forCard = answers.get(entry.cardId) ?? [];

    forCard.push(entry);
    answers.set(entry.cardId, forCard);
  }

  return answers;
}
