import {NOTE_LETTERS} from "@flashcards/shared/music/NaturalNote";
import type {Clef} from "@flashcards/content/types/Clef";
import type {Deck} from "@flashcards/content/types/Deck";
import type {VocabNote} from "@flashcards/content/types/VocabNote";

interface Range {
  readonly clef: Clef;
  readonly lowestOctave: number;
}

/** Each clef from its lowest C to the C two octaves above: middle C (C4) is the top of the bass staff and the bottom of the treble's, so it has a card on each. Treble first. */
const RANGES: readonly Range[] = [
  {clef: "treble", lowestOctave: 4},
  {clef: "bass", lowestOctave: 2},
];

/**
 * Notes read off a staff, in the treble and the bass clef, C4 to C6 and C2 to C4. Each is one card: the staff, then the note's name
 * with the note played. The pitch is the note's name, so the recording is named by it.
 */
export const SHEET_MUSIC_DECK: Deck = {
  id: "music-notes",
  name: "Sheet music",
  language: "music",
  offersVoiceAndSpeed: false,
  notes: RANGES.flatMap(notesOf),
};

function notesOf({clef, lowestOctave}: Range): VocabNote[] {
  const pitches = [lowestOctave, lowestOctave + 1].flatMap(octave => NOTE_LETTERS.map(letter => `${letter}${octave}`));

  return [...pitches, `C${lowestOctave + 2}`].map(pitch => ({
    id: `music-${clef}-${pitch.toLowerCase()}`,
    kind: "sheet-music" as const,
    language: "music" as const,
    word: pitch,
    meaning: "",
    romanisation: "",
    notation: {clef, pitch},
  }));
}
