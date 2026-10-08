import {directionsOfNote} from "@flashcards/content/cards/DirectionsOfNote";
import type {VocabNote} from "@flashcards/content/types/VocabNote";

const NOTE: VocabNote = {id: "ko-vocab-water", language: "ko", word: "물", meaning: "water", romanisation: "mul"};

it("studies a word both ways, reading it first", () => {
  expect(directionsOfNote(NOTE)).toEqual(["to-english", "from-english"]);
});

it("studies a pronunciation one way only, from its spelling", () => {
  expect(directionsOfNote({...NOTE, kind: "pronunciation"})).toEqual(["to-english"]);
});

it("studies a sounds-alike pair one way only, by ear", () => {
  expect(directionsOfNote({...NOTE, kind: "sounds-alike"})).toEqual(["to-english"]);
});

it("studies a note of music one way only, read off its staff", () => {
  expect(directionsOfNote({...NOTE, kind: "sheet-music", language: "music"})).toEqual(["to-english"]);
});
