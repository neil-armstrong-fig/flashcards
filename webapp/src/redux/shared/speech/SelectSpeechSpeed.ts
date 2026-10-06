import {selectDeckPreferences} from "@src/redux/slices/settings/selectors/SelectDeckPreferences";
import type {RootState} from "@src/redux/Store";
import type {Speed} from "@flashcards/shared/audio/Speed";

/** The speed to speak at: the one chosen for the deck being studied, and outside a deck (browsing) the one chosen for the list. */
export function selectSpeechSpeed(state: RootState): Speed {
  const deckId = state.study.session?.deckId;

  if (deckId === undefined) {
    return state.settings.speed;
  }

  return selectDeckPreferences(state, deckId).speed;
}
