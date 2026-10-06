import type {Deck} from "@flashcards/content/types/Deck";
import type {VocabNote} from "@flashcards/content/types/VocabNote";

function word(
  slug: string,
  hangul: string,
  meaning: string,
  romanisation: string,
  soundSimilars: readonly string[] = [],
): VocabNote {
  return {id: `ko-vocab-${slug}`, language: "ko", word: hangul, meaning, romanisation, soundSimilars};
}

/** Ten everyday nouns, twenty cards once each is learned both ways, to get a first review loop going. Romanisation follows the Revised Romanization of Korean. */
export const STARTER_DECK: Deck = {
  id: "ko-starter",
  name: "Korean starter words",
  language: "ko",
  notes: [
    word("water", "물", "water", "mul", ["불"]),
    word("rice", "밥", "rice, a meal", "bap"),
    word("house", "집", "house, home", "jip"),
    word("person", "사람", "person", "saram"),
    word("school", "학교", "school", "hakgyo"),
    word("friend", "친구", "friend", "chingu"),
    word("book", "책", "book", "chaek"),
    word("time", "시간", "time", "sigan"),
    word("country", "나라", "country", "nara"),
    word("korea", "한국", "Korea", "hanguk"),
  ],
};
