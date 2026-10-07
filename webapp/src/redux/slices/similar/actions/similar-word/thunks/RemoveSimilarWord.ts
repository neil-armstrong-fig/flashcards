import {recordLocalChange} from "@src/redux/shared/sync-records/RecordLocalChange";
import {removalRecord} from "@src/redux/shared/sync-records/builders/RemovalRecord";
import {similarOf} from "@src/redux/slices/similar/similars/SimilarOf";
import {similarRecordId} from "@src/redux/shared/sync-records/builders/SimilarRecordId";
import {selectNoteById} from "@src/redux/slices/deck/selectors/SelectNoteById";
import {wordRemoved} from "@src/redux/slices/similar/SimilarSlice";
import type {AppThunk} from "@src/redux/shared/AppThunk";

/**
 * Deletes a similar the learner asked for, and records that it was deleted so their other devices delete it too. The ones that ship
 * with a word are not the learner's to delete, and are refused. Resolves to whether the word was removed.
 */
export function removeSimilarWord(noteId: string, text: string): AppThunk<Promise<boolean>> {
  return async (dispatch, getState) => {
    const similar = similarOf(selectNoteById(getState(), noteId), getState().similar.words[noteId]);

    if (!similar?.learned.includes(text)) {
      return false;
    }

    dispatch(wordRemoved({noteId, text}));
    await dispatch(
      recordLocalChange(
        removalRecord({kind: "similar", id: similarRecordId(noteId, text), at: new Date().toISOString()}),
      ),
    );

    return true;
  };
}
