import {addSimilarWord} from "@src/redux/slices/similar/actions/similar-word/thunks/AddSimilarWord";
import {addingFailed} from "@src/redux/slices/similar/SimilarSlice";
import {keepAudio} from "@src/audio/kept/KeepAudio";
import {startSimilarWord} from "@src/redux/slices/similar/actions/similar-word/thunks/StartSimilarWord";
import type {AppDispatch} from "@src/redux/Store";

/**
 * Asks for a word the learner mistakes a word for, and keeps it with that word's note, in every voice and speed, for good. The word is
 * checked first, and the API checks it again. A word whose recordings cannot be fetched is reported and nothing is kept, so the learner is
 * never left with a word they cannot play. Resolves to whether the word was added.
 */
export async function addSimilarWithRecordings(dispatch: AppDispatch, noteId: string, text: string): Promise<boolean> {
  const word = dispatch(startSimilarWord(noteId, text));

  if (word === undefined) {
    return false;
  }

  try {
    await keepAudio("ko", word);
  } catch (error) {
    console.error("A similar word's recordings could not be fetched.", error);
    dispatch(addingFailed("Could not get that recording. Check your connection and try again."));

    return false;
  }

  return await dispatch(addSimilarWord(noteId, word));
}
