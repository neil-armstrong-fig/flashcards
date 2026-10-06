import type {Similar} from "@src/redux/slices/similar/types/Similar";
import type {VocabNote} from "@flashcards/content/types/VocabNote";

/** What a word is compared with: the similars that ship with it, then the ones the learner asked for. `undefined` for a note the deck does not have. */
export function similarOf(note: VocabNote | undefined, learned: readonly string[] = []): Similar | undefined {
  if (!note) {
    return undefined;
  }

  const shipped = note.soundSimilars ?? [];

  return {noteId: note.id, own: note.word, words: [...shipped, ...learned], shipped, learned};
}
