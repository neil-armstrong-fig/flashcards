import {recordLocalChange} from "@src/redux/shared/sync-records/RecordLocalChange";
import {similarRecord} from "@src/redux/shared/sync-records/builders/SimilarRecord";
import {wordAdded} from "@src/redux/slices/similar/SimilarSlice";
import type {AppThunk} from "@src/redux/shared/AppThunk";

/**
 * Adds a word the learner mistakes a word for to that word's note, and records it to be sent online the next time the app syncs. The word is
 * the one `startSimilarWord` checked, whose recordings are already kept. Resolves to whether the word was added.
 */
export function addSimilarWord(noteId: string, word: string): AppThunk<Promise<boolean>> {
  return async dispatch => {
    dispatch(wordAdded({noteId, text: word}));
    await dispatch(recordLocalChange(similarRecord({noteId, text: word, at: new Date().toISOString()})));

    return true;
  };
}
