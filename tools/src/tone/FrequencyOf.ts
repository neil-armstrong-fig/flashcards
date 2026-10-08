import {naturalNoteFrom} from "@flashcards/shared/music/NaturalNote";
import type {NoteLetter} from "@flashcards/shared/music/NaturalNote";

const A4_HERTZ = 440;
const A4_SEMITONES_FROM_C0 = 57;

const SEMITONES_ABOVE_C: Readonly<Record<NoteLetter, number>> = {C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11};

/** The frequency in hertz of a natural note named `C4`, in equal temperament with A4 at 440 Hz; `undefined` if the name is not one. */
export function frequencyOf(pitch: string): number | undefined {
  const note = naturalNoteFrom(pitch);

  if (note === undefined) {
    return undefined;
  }

  const semitonesFromC0 = note.octave * 12 + SEMITONES_ABOVE_C[note.letter];

  return A4_HERTZ * 2 ** ((semitonesFromC0 - A4_SEMITONES_FROM_C0) / 12);
}
