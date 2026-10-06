import {SIMILAR_STORAGE_KEY} from "@src/redux/slices/similar/storage/SimilarStorageKey";
import {INITIAL_SIMILAR_STATE} from "@src/redux/slices/similar/initial-state/InitialSimilarState";
import {koreanWordFrom} from "@language-learning/shared/language/KoreanText";
import {readJson} from "@src/redux/shared/device-storage/ReadJson";
import type {SimilarState} from "@src/redux/slices/similar/types/SimilarState";

/** The similar words kept on this device. What is stored is untrusted: anything that is not a Korean word is dropped. */
export function loadSimilar(): SimilarState {
  const stored = readJson(SIMILAR_STORAGE_KEY);

  if (typeof stored !== "object" || stored === null || !("words" in stored)) {
    return INITIAL_SIMILAR_STATE;
  }

  const {words} = stored;

  if (typeof words !== "object" || words === null) {
    return INITIAL_SIMILAR_STATE;
  }

  const kept: Record<string, readonly string[]> = {};

  for (const [noteId, texts] of Object.entries(words)) {
    if (Array.isArray(texts)) {
      kept[noteId] = texts.flatMap(readWord);
    }
  }

  return {...INITIAL_SIMILAR_STATE, words: kept};
}

function readWord(value: unknown): string[] {
  if (typeof value !== "string") {
    return [];
  }

  const word = koreanWordFrom(value);

  if (word === undefined) {
    return [];
  }

  return [word];
}
