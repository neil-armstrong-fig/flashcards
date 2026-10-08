import {naturalNoteFrom} from "@flashcards/shared/music/NaturalNote";

it("reads a letter and an octave", () => {
  expect(naturalNoteFrom("C4")).toEqual({letter: "C", octave: 4});
  expect(naturalNoteFrom("B0")).toEqual({letter: "B", octave: 0});
});

it("refuses a sharp, a flat, a lower-case letter, a second octave digit and anything that is not text", () => {
  for (const text of ["C#4", "Bb3", "c4", "C", "4", "H4", "C10", "", " C4", undefined, 4]) {
    expect(naturalNoteFrom(text)).toBeUndefined();
  }
});
