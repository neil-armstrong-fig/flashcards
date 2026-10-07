import {similarPayloadOf} from "@flashcards/shared/sync/records/RecordChange";
import {wordAdded, wordRemoved} from "@src/redux/slices/similar/SimilarSlice";
import type {AppThunk} from "@src/redux/shared/AppThunk";
import type {RecordChange} from "@flashcards/shared/sync/records/RecordChange";

/** Takes in a similar word the learner added or removed on another device. Nothing is recorded to send. */
export function applySimilarRecord(change: RecordChange): AppThunk {
  return (dispatch, getState) => {
    const [noteId = "", ...rest] = change.id.split("|");
    const text = rest.join("|");

    if (change.deleted) {
      dispatch(wordRemoved({noteId, text}));

      return;
    }

    const word = similarPayloadOf(change);

    if (word !== undefined && !(getState().similar.words[word.noteId] ?? []).includes(word.text)) {
      dispatch(wordAdded({noteId: word.noteId, text: word.text}));
    }
  };
}
