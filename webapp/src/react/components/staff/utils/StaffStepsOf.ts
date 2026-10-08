import {naturalNoteFrom, NOTE_LETTERS} from "@flashcards/shared/music/NaturalNote";
import type {Clef} from "@flashcards/content/types/Clef";
import type {NaturalNote} from "@flashcards/shared/music/NaturalNote";

/** The note each clef's bottom line is: E4 in the treble clef, G2 in the bass. */
const BOTTOM_LINES: Readonly<Record<Clef, NaturalNote>> = {
  treble: {letter: "E", octave: 4},
  bass: {letter: "G", octave: 2},
};

/**
 * How many steps (a line to the space above it) a note sits above the bottom line of a staff: 0 is on the bottom line, 1 in the
 * space above it, -2 two below (middle C under the treble staff). `undefined` where the pitch is not a natural note.
 */
export function staffStepsOf(clef: Clef, pitch: string): number | undefined {
  const note = naturalNoteFrom(pitch);

  if (note === undefined) {
    return undefined;
  }

  return diatonicNumberOf(note) - diatonicNumberOf(BOTTOM_LINES[clef]);
}

/** Counts letters up the scale, so C4 is 28 and D4 is 29; one step on the staff is one number. */
function diatonicNumberOf({letter, octave}: NaturalNote): number {
  return octave * NOTE_LETTERS.length + NOTE_LETTERS.indexOf(letter);
}
