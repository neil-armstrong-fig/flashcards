import type {CardDirection} from "@language-learning/content/CardDirection";
import type {DeckCard} from "@language-learning/content/types/DeckCard";
import type {SpokenText} from "@language-learning/content/types/SpokenText";
import type {VocabNote} from "@language-learning/content/types/VocabNote";

/** The card that asks `note` in one direction. */
export function cardOfNote(note: VocabNote, direction: CardDirection): DeckCard {
  const toEnglish = direction === "to-english";
  const target: SpokenText = {language: note.language, text: note.word};
  const english: SpokenText | undefined = note.kind === "kana" ? undefined : {language: "en", text: note.meaning};

  return {
    id: `${note.id}/${direction}`,
    noteId: note.id,
    direction,
    front: toEnglish ? note.word : note.meaning,
    back: toEnglish ? note.meaning : note.word,
    frontAudio: toEnglish ? target : english,
    backAudio: toEnglish ? english : target,
    hint: note.romanisation,
  };
}
