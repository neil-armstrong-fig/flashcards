import {memoryNotePayloadOf} from "@flashcards/shared/sync/records/RecordChange";
import {noteRemoved, noteWritten} from "@src/redux/slices/card-notes/CardNotesSlice";
import type {AppThunk} from "@src/redux/shared/AppThunk";
import type {RecordChange} from "@flashcards/shared/sync/records/RecordChange";

/** Takes in a note on a card that the learner wrote or removed on another device, dated as it was there so that fading agrees. Nothing is recorded to send. */
export function applyMemoryNoteRecord(change: RecordChange): AppThunk {
  return dispatch => {
    if (change.deleted) {
      dispatch(noteRemoved(change.id));

      return;
    }

    const note = memoryNotePayloadOf(change);

    if (note !== undefined) {
      dispatch(noteWritten({cardId: change.id, text: note.text, addedAt: change.at}));
    }
  };
}
