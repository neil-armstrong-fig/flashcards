import {selectCardById} from "@src/redux/slices/deck/selectors/SelectCardById";
import type {RootState} from "@src/redux/Store";
import type {SpokenText} from "@language-learning/content/types/SpokenText";

/**
 * What is spoken for the card on screen right now: its front while the answer is hidden, and its answer once shown. Nothing
 * when no card is up.
 */
export function selectSpokenOnScreen(state: RootState): SpokenText | undefined {
  const session = state.study.session;
  const id = session?.currentCardId;

  if (!id) {
    return undefined;
  }

  const card = selectCardById(state, id);

  if (!card) {
    return undefined;
  }

  if (session.answerShown) {
    return card.backAudio;
  }

  return card.frontAudio;
}
