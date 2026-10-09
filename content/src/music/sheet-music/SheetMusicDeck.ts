import {NOTE_LETTERS} from "@flashcards/shared/music/NaturalNote";
import type {Clef} from "@flashcards/content/types/Clef";
import type {Deck} from "@flashcards/content/types/Deck";

interface Range {
  readonly clef: Clef;
  readonly lowestOctave: number;
}

interface SheetMusicNote {
  readonly clef: Clef;
  readonly pitch: string;
}

const RANGES: readonly Range[] = [
  {clef: "treble", lowestOctave: 4},
  {clef: "bass", lowestOctave: 2},
];

/** Both clefs and distant pitches are interleaved, so the previous card does not give the next one away. */
const MIXED_NOTES: readonly SheetMusicNote[] = [
  {clef: "treble", pitch: "G5"},
  {clef: "bass", pitch: "E2"},
  {clef: "treble", pitch: "C4"},
  {clef: "bass", pitch: "B3"},
  {clef: "treble", pitch: "D5"},
  {clef: "bass", pitch: "G2"},
  {clef: "treble", pitch: "B4"},
  {clef: "bass", pitch: "C3"},
  {clef: "treble", pitch: "F5"},
  {clef: "bass", pitch: "C4"},
  {clef: "treble", pitch: "E4"},
  {clef: "bass", pitch: "A2"},
  {clef: "treble", pitch: "C6"},
  {clef: "bass", pitch: "F3"},
  {clef: "treble", pitch: "A4"},
  {clef: "bass", pitch: "D2"},
  {clef: "treble", pitch: "C5"},
  {clef: "bass", pitch: "A3"},
  {clef: "treble", pitch: "F4"},
  {clef: "bass", pitch: "B2"},
  {clef: "treble", pitch: "B5"},
  {clef: "bass", pitch: "E3"},
  {clef: "treble", pitch: "D4"},
  {clef: "bass", pitch: "C2"},
  {clef: "treble", pitch: "A5"},
  {clef: "bass", pitch: "G3"},
  {clef: "treble", pitch: "G4"},
  {clef: "bass", pitch: "F2"},
  {clef: "treble", pitch: "E5"},
  {clef: "bass", pitch: "D3"},
];

/**
 * Notes read off a staff, in the treble and the bass clef, C4 to C6 and C2 to C4, in mixed order. Each is one card: the staff,
 * then the note's name with the note played. The v2 ids intentionally restart progress from the original scale-ordered deck.
 */
export const SHEET_MUSIC_DECK: Deck = {
  id: "music-notes",
  name: "Sheet music",
  language: "music",
  offersVoiceAndSpeed: false,
  notes: MIXED_NOTES.map(({clef, pitch}) => {
    return {
      id: `music-${clef}-${pitch.toLowerCase()}-v2`,
      kind: "sheet-music" as const,
      language: "music" as const,
      word: pitch,
      meaning: "",
      romanisation: "",
      notation: {clef, pitch},
    };
  }),
  retiredNoteIds: RANGES.flatMap(retiredNoteIdsOf),
};

function retiredNoteIdsOf({clef, lowestOctave}: Range): string[] {
  const pitches = [lowestOctave, lowestOctave + 1].flatMap(octave => NOTE_LETTERS.map(letter => `${letter}${octave}`));

  return [...pitches, `C${lowestOctave + 2}`].map(pitch => `music-${clef}-${pitch.toLowerCase()}`);
}
