import type {SoundsAlikePair} from "@flashcards/content/korean/sounds-alike/types/SoundsAlikePair";
import type {PairedWord} from "@flashcards/content/korean/sounds-alike/types/SoundsAlikePair";
import type {VocabNote} from "@flashcards/content/types/VocabNote";

/**
 * The two notes of a pair, one saying each word. Both show `바르다/빠르다` (the first word first, whichever is said), so the
 * learner has to listen to know which they were given. Ids end in `-a` and `-b`, after the pair's own written-out id.
 */
export function notesOfSoundsAlikePair(pair: SoundsAlikePair): readonly [VocabNote, VocabNote] {
  const both = `${pair.first.word}/${pair.second.word}`;

  return [noteOf(pair, "a", pair.first, pair.second, both), noteOf(pair, "b", pair.second, pair.first, both)];
}

function noteOf(pair: SoundsAlikePair, side: string, said: PairedWord, other: PairedWord, both: string): VocabNote {
  return {
    id: `ko-sounds-alike-${pair.id}-${side}`,
    kind: "sounds-alike",
    language: "ko",
    word: said.word,
    meaning: both,
    romanisation: said.romanisation,
    soundSimilars: [other.word],
    explanation: pair.explanation,
  };
}
