import {englishMeaningFrom} from "@language-learning/shared/language/EnglishText";
import {isRecord} from "@src/json/IsRecord";
import {koreanWordFrom} from "@language-learning/shared/language/KoreanText";
import {noteIdFrom} from "@src/router/routes/notes/shared/utils/NoteIdFrom";
import {romanisationFrom} from "@language-learning/shared/language/RomanisationText";
import type {Note} from "@src/database/types/Note";

/** A card to keep, or `undefined` for anything else. Nothing in the body is trusted until it has been checked. */
export function noteRequestFrom(body: unknown): Note | undefined {
  if (!isRecord(body)) {
    return undefined;
  }

  const {word, meaning, romanisation} = body;
  const id = noteIdFrom(body);

  if (id === undefined || typeof word !== "string" || typeof meaning !== "string" || typeof romanisation !== "string") {
    return undefined;
  }

  const koreanWord = koreanWordFrom(word);
  const englishMeaning = englishMeaningFrom(meaning);
  const latin = romanisationFrom(romanisation);

  if (koreanWord === undefined || englishMeaning === undefined || latin === undefined) {
    return undefined;
  }

  return {id, word: koreanWord, meaning: englishMeaning, romanisation: latin};
}
