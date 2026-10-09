import {PRONUNCIATION_GROUPS} from "@flashcards/content/dutch/pronunciation/PronunciationGroups";
import type {Deck} from "@flashcards/content/types/Deck";

/**
 * Dutch words read from their spelling. Each is one card: the spelling, unspoken, to read aloud; then how it sounds respelt for
 * an English reader, what it means in English, and the word spoken. A learner who can say what they see can then hear whether they were right. There is no
 * romanisation, since Dutch is already in Latin letters, so the card's hint is empty.
 */
export const PRONUNCIATION_DECK: Deck = {
  id: "nl-pronunciation",
  name: "Dutch pronunciation",
  language: "nl",
  notes: PRONUNCIATION_GROUPS.flatMap(group =>
    group.words.map(({id, word, said, translation}) => ({
      id,
      kind: "pronunciation" as const,
      language: "nl" as const,
      word,
      meaning: said,
      romanisation: "",
      translation,
      explanation: `${group.rule}: ${group.explanation}`,
    })),
  ),
};
