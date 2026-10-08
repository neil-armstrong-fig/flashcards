import {cardsOfDeck} from "@flashcards/content/cards/CardsOfDeck";
import {SOUNDS_ALIKE_PAIRS} from "@flashcards/content/korean/sounds-alike/SoundsAlikePairs";
import {SOUNDS_ALIKE_DECK} from "@flashcards/content/korean/sounds-alike/SoundsAlikeDeck";
import {romanisationOf} from "@flashcards/shared/language/RomanisationOf";

it("gives every pair an id of its own, and so every note", () => {
  const pairIds = SOUNDS_ALIKE_PAIRS.map(pair => pair.id);
  const noteIds = SOUNDS_ALIKE_DECK.notes.map(note => note.id);

  expect(new Set(pairIds).size).toBe(pairIds.length);
  expect(new Set(noteIds).size).toBe(noteIds.length);
  expect(noteIds.every(id => id.startsWith("ko-sounds-alike-"))).toBe(true);
});

it("makes two cards of each pair, with their own ids", () => {
  const ids = cardsOfDeck(SOUNDS_ALIKE_DECK).map(card => card.id);

  expect(ids).toHaveLength(SOUNDS_ALIKE_PAIRS.length * 2);
  expect(new Set(ids).size).toBe(ids.length);
});

it("shows the same text on both cards of a pair, and says a different word on each", () => {
  const [first, second] = cardsOfDeck(SOUNDS_ALIKE_DECK);

  expect(first?.front).toBe("바르다/빠르다");
  expect(second?.front).toBe("바르다/빠르다");
  expect(first?.frontAudio?.text).toBe("바르다");
  expect(second?.frontAudio?.text).toBe("빠르다");
  expect(first?.emphasis).toBe("바르다");
  expect(second?.emphasis).toBe("빠르다");
});

it("never pairs a word with itself, and explains every pair", () => {
  for (const pair of SOUNDS_ALIKE_PAIRS) {
    expect(pair.first.word).not.toBe(pair.second.word);
    expect(pair.explanation).toContain(pair.first.word);
    expect(pair.explanation).toContain(pair.second.word);
  }
});

it("romanises each word as the standard romanisation does, which is what the card shows as its hint", () => {
  const mismatches = SOUNDS_ALIKE_PAIRS.flatMap(pair =>
    [pair.first, pair.second].filter(({word, romanisation}) => romanisationOf(word) !== romanisation),
  );

  expect(mismatches).toEqual([]);
});

it("picks out a word that appears once in the text, so the bold part is never in doubt", () => {
  const cards = cardsOfDeck(SOUNDS_ALIKE_DECK);

  expect(cards.filter(card => card.emphasis === undefined || card.back.split(card.emphasis).length !== 2)).toEqual([]);
});
