import {cardsOfDeck} from "@flashcards/content/cards/CardsOfDeck";
import {PRONUNCIATION_DECK} from "@flashcards/content/korean/pronunciation/PronunciationDeck";
import {PRONUNCIATION_GROUPS} from "@flashcards/content/korean/pronunciation/PronunciationGroups";
import {romanisationOf} from "@flashcards/shared/language/RomanisationOf";

const ADDS_AN_N = "Added ㄴ";

const TENSE_TO_PLAIN: Readonly<Record<string, string>> = {
  "\u1101": "\u1100",
  "\u1104": "\u1103",
  "\u1108": "\u1107",
  "\u110A": "\u1109",
  "\u110D": "\u110C",
};

/** The Revised Romanization does not write a tense consonant, and `koroman` doubles it wrongly, so a tensed initial is compared as its plain one. */
function untensed(hangul: string): string {
  return [...hangul.normalize("NFD")]
    .map(letter => TENSE_TO_PLAIN[letter] ?? letter)
    .join("")
    .normalize("NFC");
}

it("gives every note an id of its own, in the form that names its language and kind, because progress is kept by id", () => {
  const ids = PRONUNCIATION_DECK.notes.map(note => note.id);

  expect(new Set(ids).size).toBe(ids.length);
  expect(ids.every(id => id.startsWith("ko-pronunciation-"))).toBe(true);
});

it("makes one card of each note, and gives it an id of its own", () => {
  const ids = cardsOfDeck(PRONUNCIATION_DECK).map(card => card.id);

  expect(ids).toHaveLength(PRONUNCIATION_DECK.notes.length);
  expect(new Set(ids).size).toBe(ids.length);
});

it("shows the spelling unspoken, then the way it is said and its English meaning, with the word spoken", () => {
  const [card] = cardsOfDeck(PRONUNCIATION_DECK);

  expect(card).toMatchObject({
    front: "좋다",
    back: "[조타]",
    hint: "jota; to be good",
    backAudio: {language: "ko", text: "좋다"},
  });
  expect(card?.frontAudio).toBeUndefined();
});

it("explains the rule on every note", () => {
  expect(PRONUNCIATION_DECK.notes.every(note => note.explanation !== undefined && note.explanation.length > 20)).toBe(
    true,
  );
});

it("gives every word an English meaning", () => {
  expect(PRONUNCIATION_GROUPS.flatMap(group => group.words).every(({translation}) => translation !== "")).toBe(true);
});

it("says every word as the sound rules give it: what the spelling romanises to is what the pronunciation romanises to", () => {
  const mismatches = PRONUNCIATION_GROUPS.filter(group => group.rule !== ADDS_AN_N).flatMap(group =>
    group.words.filter(({word, said}) => romanisationOf(untensed(word)) !== romanisationOf(untensed(said))),
  );

  expect(mismatches).toEqual([]);
});

it("romanises every word as it is said, which is what the card form would suggest (the added ㄴ is written from the sound)", () => {
  const mismatches = PRONUNCIATION_GROUPS.flatMap(group =>
    group.words.filter(({word, said, romanisation}) => {
      const from = group.rule === ADDS_AN_N ? said : word;

      return romanisationOf(from) !== romanisation;
    }),
  );

  expect(mismatches).toEqual([]);
});

it("changes the sound of every word: a spelling that is said as written does not belong", () => {
  expect(PRONUNCIATION_GROUPS.flatMap(group => group.words).filter(({word, said}) => word === said)).toEqual([]);
});
