import {runtime} from "@src/environment/Runtime";
import {recordingFilesOfDeck} from "@src/audio/deck-recordings/recording-files/RecordingFilesOfDeck";
import {SHIPPED_DECKS} from "@language-learning/content/decks/ShippedDecks";

/** The paths (`audio/...`, as the player asks for them) of every recording of a shipped deck. Empty for a deck that is not one. */
export function deckRecordingPaths(deckId: string): string[] {
  const deck = SHIPPED_DECKS.find(each => each.id === deckId);

  if (deck === undefined) {
    return [];
  }

  return recordingFilesOfDeck(deck, runtime.audioRecordings).map(file => `audio/${file}`);
}
