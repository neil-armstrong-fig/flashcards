import {DEFAULT_DECK_PREFERENCES} from "@src/redux/slices/settings/limits/DefaultDeckPreferences";
import {INITIAL_SETTINGS_STATE} from "@src/redux/slices/settings/initial-state/InitialSettingsState";
import {readBoolean} from "@src/redux/slices/settings/persistence/read/ReadBoolean";
import {readOneOf} from "@src/redux/slices/settings/persistence/read/ReadOneOf";
import {SPEEDS} from "@flashcards/shared/audio/Speed";
import {VOICES} from "@flashcards/shared/audio/Voice";
import type {Speed} from "@flashcards/shared/audio/Speed";
import type {Voice} from "@flashcards/shared/audio/Voice";
import type {DeckPreferences} from "@src/redux/slices/settings/types/DeckPreferences";

/** What was kept when there was one voice, speed and listen-only choice for every deck, which a deck with none of its own takes on. */
interface EarlierPreferences {
  readonly voice?: Voice;
  readonly speed?: Speed;
  readonly hideTarget?: boolean;
}

/**
 * How every deck the app ships is heard and shown, from what was kept. What was kept is untrusted: a bad field falls back to its
 * default alone, or to `earlier`, the choices made before there was one for each deck.
 */
export function readDeckPreferences(
  stored: unknown,
  earlier: EarlierPreferences,
): Readonly<Record<string, DeckPreferences>> {
  const preferences: Record<string, DeckPreferences> = {};

  for (const deckId of Object.keys(INITIAL_SETTINGS_STATE.deckPreferences)) {
    preferences[deckId] = readOneDeck(
      typeof stored === "object" && stored !== null ? Reflect.get(stored, deckId) : undefined,
      earlier,
    );
  }

  return preferences;
}

function readOneDeck(stored: unknown, earlier: EarlierPreferences): DeckPreferences {
  const fallback: DeckPreferences = {
    voice: earlier.voice ?? DEFAULT_DECK_PREFERENCES.voice,
    speed: earlier.speed ?? DEFAULT_DECK_PREFERENCES.speed,
    hideTarget: earlier.hideTarget ?? DEFAULT_DECK_PREFERENCES.hideTarget,
  };

  if (typeof stored !== "object" || stored === null) {
    return fallback;
  }

  return {
    voice: readOneOf(Reflect.get(stored, "voice"), VOICES) ?? fallback.voice,
    speed: readOneOf(Reflect.get(stored, "speed"), SPEEDS) ?? fallback.speed,
    hideTarget: readBoolean(Reflect.get(stored, "hideTarget")) ?? fallback.hideTarget,
  };
}
