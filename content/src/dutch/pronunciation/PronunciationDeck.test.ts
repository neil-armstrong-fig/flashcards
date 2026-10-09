import {cardsOfDeck} from "@flashcards/content/cards/CardsOfDeck";
import {PRONUNCIATION_DECK} from "@flashcards/content/dutch/pronunciation/PronunciationDeck";
import {PRONUNCIATION_GROUPS} from "@flashcards/content/dutch/pronunciation/PronunciationGroups";

it("gives every note an id of its own, in the form that names its language and kind, because progress is kept by id", () => {
  const ids = PRONUNCIATION_DECK.notes.map(note => note.id);

  expect(new Set(ids).size).toBe(ids.length);
  expect(ids.every(id => id.startsWith("nl-pronunciation-"))).toBe(true);
});

it("makes one card of each note, and gives it an id of its own", () => {
  const ids = cardsOfDeck(PRONUNCIATION_DECK).map(card => card.id);

  expect(ids).toHaveLength(PRONUNCIATION_DECK.notes.length);
  expect(new Set(ids).size).toBe(ids.length);
});

it("shows the spelling unspoken, then how it sounds and what it means, with the word spoken in Dutch", () => {
  const [card] = cardsOfDeck(PRONUNCIATION_DECK);

  expect(card).toMatchObject({front: "bed", back: "[bet]", hint: "bed", backAudio: {language: "nl", text: "bed"}});
  expect(card?.frontAudio).toBeUndefined();
});

it("explains the pattern on every note", () => {
  expect(PRONUNCIATION_DECK.notes.every(note => note.explanation !== undefined && note.explanation.length > 20)).toBe(
    true,
  );
});

it("respells every word, and puts the stress in capitals on every word of more than one syllable", () => {
  const words = PRONUNCIATION_GROUPS.flatMap(group => group.words);
  const unstressed = words.filter(({said}) => said.includes(" ") && said === said.toLowerCase());

  expect(words.every(({said}) => said !== "")).toBe(true);
  expect(unstressed).toEqual([]);
});

it("translates every word into English, which is shown but never spoken", () => {
  const words = PRONUNCIATION_GROUPS.flatMap(group => group.words);
  const cards = cardsOfDeck(PRONUNCIATION_DECK);

  expect(words.every(({translation}) => translation !== "")).toBe(true);
  expect(cards.every(card => card.hint !== "" && card.frontAudio === undefined)).toBe(true);
  expect(cards.every(card => card.backAudio?.language === "nl")).toBe(true);
});
