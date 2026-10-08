import {englishMeaningFrom} from "@flashcards/shared/language/EnglishText";
import {isCustomNoteId} from "@src/redux/slices/deck/ids/CustomNoteId";
import {koreanWordFrom} from "@flashcards/shared/language/KoreanText";
import {romanisationFrom} from "@flashcards/shared/language/RomanisationText";
import type {VocabNote} from "@flashcards/content/types/VocabNote";

/** A card the learner made, from a value that has come from outside (storage, the API), or `undefined` if it is not one. Never cast. */
export function readCustomNote(value: unknown): VocabNote | undefined {
  if (typeof value !== "object" || value === null) {
    return undefined;
  }

  const id: unknown = Reflect.get(value, "id");
  const word: unknown = Reflect.get(value, "word");
  const meaning: unknown = Reflect.get(value, "meaning");
  const romanisation: unknown = Reflect.get(value, "romanisation");

  if (
    typeof id !== "string" ||
    !isCustomNoteId(id) ||
    typeof word !== "string" ||
    typeof meaning !== "string" ||
    typeof romanisation !== "string"
  ) {
    return undefined;
  }

  const korean = koreanWordFrom(word);
  const english = englishMeaningFrom(meaning);
  const latin = romanisationFrom(romanisation);

  if (korean === undefined || english === undefined || latin === undefined) {
    return undefined;
  }

  return {id, language: "ko", word: korean, meaning: english, romanisation: latin};
}
