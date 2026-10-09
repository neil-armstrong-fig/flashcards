import {PRONUNCIATION_GROUPS} from "@flashcards/content/korean/pronunciation/PronunciationGroups";
import type {Deck} from "@flashcards/content/types/Deck";

/**
 * Korean words read from their spelling, whose sound is not what the spelling says (좋다 is said 조타). Each is one card: the
 * spelling, unspoken, to read aloud; then how it is said in hangul and the word spoken. A learner who can say what they see
 * can then hear whether they were right.
 */
export const PRONUNCIATION_DECK: Deck = {
  id: "ko-pronunciation",
  name: "Korean pronunciation",
  language: "ko",
  notes: PRONUNCIATION_GROUPS.flatMap(group =>
    group.words.map(({id, word, said, romanisation, translation}) => ({
      id,
      kind: "pronunciation" as const,
      language: "ko" as const,
      word,
      meaning: said,
      romanisation,
      translation,
      explanation: `${group.rule}: ${group.explanation}`,
    })),
  ),
};
