/** The seven letters a natural note is named by, lowest in the octave first: an octave starts at C. */
export const NOTE_LETTERS = ["C", "D", "E", "F", "G", "A", "B"] as const;

export type NoteLetter = (typeof NOTE_LETTERS)[number];

/** A note with no sharp or flat, such as `C4` (middle C) or `A2`. */
export interface NaturalNote {
  readonly letter: NoteLetter;
  readonly octave: number;
}

const NATURAL_NOTE = /^(?<letter>[A-G])(?<octave>[0-9])$/;

/** The note a name such as `C4` stands for, or `undefined` for anything else (a sharp, a flat, a number out of range). */
export function naturalNoteFrom(text: unknown): NaturalNote | undefined {
  if (typeof text !== "string") {
    return undefined;
  }

  const groups = NATURAL_NOTE.exec(text)?.groups;
  const letter = NOTE_LETTERS.find(candidate => candidate === groups?.["letter"]);
  const octave = Number(groups?.["octave"]);

  if (letter === undefined || groups === undefined) {
    return undefined;
  }

  return {letter, octave};
}
