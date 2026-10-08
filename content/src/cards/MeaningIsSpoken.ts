import type {VocabNote} from "@flashcards/content/types/VocabNote";

/** Whether the note's `meaning` is an English meaning to be spoken. A kana's sound, a pronunciation and a sounds-alike pair are written for the eye: an English voice would say them wrongly. */
export function meaningIsSpoken(note: VocabNote): boolean {
  return note.kind !== "kana" && note.kind !== "pronunciation" && note.kind !== "sounds-alike";
}
