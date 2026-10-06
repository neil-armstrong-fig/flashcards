import type {CardDirection} from "@flashcards/content/CardDirection";
import type {DeckCard} from "@flashcards/content/types/DeckCard";
import type {SpokenText} from "@flashcards/content/types/SpokenText";
import type {VocabNote} from "@flashcards/content/types/VocabNote";

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
