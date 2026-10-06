import {shapeSimilarsOf} from "@flashcards/content/japanese/shape-similars/ShapeSimilarsOf";
import {soundSimilarsOf} from "@flashcards/content/japanese/sound-similars/SoundSimilarsOf";
import type {Kana} from "@flashcards/content/japanese/Kana";
import type {KanaScript} from "@flashcards/content/japanese/types/KanaScript";
import type {VocabNote} from "@flashcards/content/types/VocabNote";

/**
 * A note for each kana, written in the script given. The id is `ja-<script>-<romaji>` whichever deck the note is in, because
 * progress is kept by id and a note must keep its own when the decks are divided differently.
 */
export function kanaNotesOf(kana: readonly Kana[], script: KanaScript): VocabNote[] {
  return kana.map(entry => ({
    id: `ja-${script}-${entry.romaji}`,
    kind: "kana",
    language: "ja",
    word: entry[script],
    meaning: entry.romaji,
    romanisation: "",
    soundSimilars: soundSimilarsOf(entry, script),
    shapeSimilars: shapeSimilarsOf(entry[script]),
  }));
}
