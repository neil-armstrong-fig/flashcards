import {cardsOfDeck} from "@flashcards/content/cards/CardsOfDeck";
import {SHEET_MUSIC_DECK} from "@flashcards/content/music/sheet-music/SheetMusicDeck";
import {naturalNoteFrom} from "@flashcards/shared/music/NaturalNote";

it("gives every note an id of its own, because progress is kept by id", () => {
  const ids = SHEET_MUSIC_DECK.notes.map(note => note.id);

  expect(new Set(ids).size).toBe(ids.length);
  expect(ids.every(id => id.startsWith("music-"))).toBe(true);
});

it("makes one card of each of 15 treble and 15 bass notes, middle C first", () => {
  const cards = cardsOfDeck(SHEET_MUSIC_DECK);

  expect(cards).toHaveLength(30);
  expect(cards[0]).toMatchObject({id: "music-treble-c4/to-english", notation: {clef: "treble", pitch: "C4"}});
  expect(cards[15]).toMatchObject({id: "music-bass-c2/to-english", notation: {clef: "bass", pitch: "C2"}});
});

it("draws every note at the pitch it is named and plays that pitch", () => {
  for (const card of cardsOfDeck(SHEET_MUSIC_DECK)) {
    expect(naturalNoteFrom(card.notation?.pitch)).toBeDefined();
    expect(card.backAudio).toEqual({language: "music", text: card.notation?.pitch});
  }
});
