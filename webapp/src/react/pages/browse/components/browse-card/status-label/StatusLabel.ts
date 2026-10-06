import {formatInterval} from "@src/react/pages/shared/utils/FormatInterval";
import type {CardStatus} from "@src/spaced-repetition/card/types/CardStatus";

/** Where a card is, in words: `New`, `Learning`, `Due`, `Due in 4d`, `Suspended`, `Buried until tomorrow`. */
export function statusLabelOf(status: CardStatus): string {
  if (status.kind === "scheduled") {
    return `Due in ${formatInterval(status.dueInMs ?? 0)}`;
  }

  return LABELS[status.kind];
}

const LABELS: Record<Exclude<CardStatus["kind"], "scheduled">, string> = {
  new: "New",
  learning: "Learning",
  due: "Due",
  suspended: "Suspended",
  buried: "Buried until tomorrow",
};
