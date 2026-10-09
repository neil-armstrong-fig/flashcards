import {cardsOfDeck} from "@flashcards/content/cards/CardsOfDeck";
import {SHEET_MUSIC_DECK} from "@flashcards/content/music/sheet-music/SheetMusicDeck";
import {naturalNoteFrom} from "@flashcards/shared/music/NaturalNote";

it("gives every note a revised id of its own, resetting the old ordered deck's progress", () => {
  const ids = SHEET_MUSIC_DECK.notes.map(note => note.id);

  expect(new Set(ids).size).toBe(ids.length);
  expect(ids.every(id => id.startsWith("music-") && id.endsWith("-v2"))).toBe(true);
});

it("mixes one card of each of 15 treble and 15 bass notes instead of teaching them up each scale", () => {
  const cards = cardsOfDeck(SHEET_MUSIC_DECK);

  expect(cards).toHaveLength(30);
  expect(cards.map(card => card.notation)).toEqual([
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
  ]);
});

it("draws every note at the pitch it is named and plays that pitch", () => {
  for (const card of cardsOfDeck(SHEET_MUSIC_DECK)) {
    expect(naturalNoteFrom(card.notation?.pitch)).toBeDefined();
    expect(card.backAudio).toEqual({language: "music", text: card.notation?.pitch});
  }
});
