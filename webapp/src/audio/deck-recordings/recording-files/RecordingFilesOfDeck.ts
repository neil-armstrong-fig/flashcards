import type {AudioManifest} from "@language-learning/content/audio/types/AudioManifest";
import type {Deck} from "@language-learning/content/types/Deck";

/**
 * Every recording a deck can play, each once, as paths under `audio/`: every version of each word and of what it is mistaken for (a
 * learner may switch voice or speed at any card), and each English meaning, except the sound of a kana, which is never spoken. A text the
 * manifest has no recording of is left out. It is what keeping a deck offline fetches.
 */
export function recordingFilesOfDeck(deck: Deck, manifest: AudioManifest): string[] {
  const files = new Set<string>();

  for (const note of deck.notes) {
    for (const text of [note.word, ...(note.soundSimilars ?? [])]) {
      addAll(files, manifest[note.language]?.[text]);
    }

    if (note.kind !== "kana") {
      addAll(files, manifest["en"]?.[note.meaning]);
    }
  }

  return [...files];
}

function addAll(files: Set<string>, recorded: Readonly<Record<string, string | undefined>> | undefined): void {
  for (const file of Object.values(recorded ?? {})) {
    if (file !== undefined) {
      files.add(file);
    }
  }
}
