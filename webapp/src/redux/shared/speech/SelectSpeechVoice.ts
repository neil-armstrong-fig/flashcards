import {selectDeckPreferences} from "@src/redux/slices/settings/selectors/SelectDeckPreferences";
import type {RootState} from "@src/redux/Store";
import type {Voice} from "@flashcards/shared/audio/Voice";

/** The voice to speak in: the one chosen for the deck being studied, and outside a deck (browsing) the one chosen for the list. */
export function selectSpeechVoice(state: RootState): Voice {
  const deckId = state.study.session?.deckId;

  if (deckId === undefined) {
    return state.settings.voice;
  }

  return selectDeckPreferences(state, deckId).voice;
}
