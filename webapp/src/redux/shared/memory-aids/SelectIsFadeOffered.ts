import {selectIsStruggling} from "@src/redux/shared/struggling/SelectIsStruggling";
import {shouldFadeAids} from "@src/spaced-repetition/card/fading/ShouldFadeAids";
import type {RootState} from "@src/redux/Store";

/**
 * Whether the card on screen should offer to take its note and picture off: it has one, the latest of them has been through
 * three good answers, and the card is not on the Struggling list (where it wants more help, not less). Derived, never stored.
 */
export function selectIsFadeOffered(state: RootState): boolean {
  const cardId = state.study.session?.currentCardId;

  if (cardId === undefined || selectIsStruggling(state, cardId)) {
    return false;
  }

  const stamps = [state.cardNotes.addedAt[cardId], state.cardPictures.addedAt[cardId]].filter(
    (stamp): stamp is string => stamp !== undefined,
  );

  if (stamps.length === 0) {
    return false;
  }

  const answers = state.study.log.filter(entry => entry.cardId === cardId);

  const newest = [...stamps].sort().at(-1) ?? "";

  return shouldFadeAids(newest, answers);
}
