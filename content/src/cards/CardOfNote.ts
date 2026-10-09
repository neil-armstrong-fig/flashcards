import {meaningIsSpoken} from "@flashcards/content/cards/MeaningIsSpoken";
import type {CardDirection} from "@flashcards/content/CardDirection";
import type {DeckCard} from "@flashcards/content/types/DeckCard";
import type {SpokenText} from "@flashcards/content/types/SpokenText";
import type {VocabNote} from "@flashcards/content/types/VocabNote";

/** The card that asks `note` in one direction. */
export function cardOfNote(note: VocabNote, direction: CardDirection): DeckCard {
  const target: SpokenText = {language: note.language, text: note.word};

  if (note.kind === "pronunciation") {
    return {
      id: `${note.id}/${direction}`,
      noteId: note.id,
      direction,
      front: note.word,
      back: `[${note.meaning}]`,
      frontAudio: undefined,
      backAudio: target,
      hint: pronunciationHintOf(note),
    };
  }

  if (note.kind === "sheet-music") {
    return {
      id: `${note.id}/${direction}`,
      noteId: note.id,
      direction,
      front: "",
      notation: note.notation,
      back: note.word,
      frontAudio: undefined,
      backAudio: target,
      hint: note.romanisation,
    };
  }

  if (note.kind === "sounds-alike") {
    return {
      id: `${note.id}/${direction}`,
      noteId: note.id,
      direction,
      front: note.meaning,
      back: note.meaning,
      frontAudio: target,
      backAudio: target,
      emphasis: note.word,
      hint: note.romanisation,
    };
  }

  if (note.kind === "kana") {
    if (direction === "to-english") {
      return {
        id: `${note.id}/${direction}`,
        noteId: note.id,
        direction,
        front: note.word,
        back: note.meaning,
        frontAudio: undefined,
        backAudio: target,
        hint: note.romanisation,
      };
    }

    return {
      id: `${note.id}/${direction}`,
      noteId: note.id,
      direction,
      front: note.meaning,
      back: note.word,
      frontAudio: undefined,
      backAudio: target,
      hint: note.romanisation,
    };
  }

  const toEnglish = direction === "to-english";
  const english: SpokenText | undefined = meaningIsSpoken(note) ? {language: "en", text: note.meaning} : undefined;

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

function pronunciationHintOf(note: VocabNote): string {
  if (note.translation === undefined) {
    return note.romanisation;
  }

  if (note.romanisation === "") {
    return note.translation;
  }

  return `${note.romanisation}; ${note.translation}`;
}
