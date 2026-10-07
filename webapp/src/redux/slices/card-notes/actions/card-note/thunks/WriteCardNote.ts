import {memoryNoteRecord} from "@src/redux/shared/sync-records/builders/MemoryNoteRecord";
import {noteWritten} from "@src/redux/slices/card-notes/CardNotesSlice";
import {recordLocalChange} from "@src/redux/shared/sync-records/RecordLocalChange";
import {removalRecord} from "@src/redux/shared/sync-records/builders/RemovalRecord";
import type {AppThunk} from "@src/redux/shared/AppThunk";

/** Writes the learner's note on the card now on screen, dated now so that fading counts the answers that follow, and records it for their other devices. */
export function writeCardNote(text: string): AppThunk<Promise<void>> {
  return async (dispatch, getState) => {
    const cardId = getState().study.session?.currentCardId;

    if (cardId === undefined) {
      return;
    }

    const had = getState().cardNotes.byCard[cardId] !== undefined;
    const now = new Date();

    dispatch(noteWritten({cardId, text, addedAt: now.toISOString()}));

    const kept = getState().cardNotes.byCard[cardId];

    if (kept !== undefined) {
      await dispatch(recordLocalChange(memoryNoteRecord({cardId, text: kept, at: now.toISOString()})));
      return;
    }

    if (had) {
      await dispatch(recordLocalChange(removalRecord({kind: "memory-note", id: cardId, at: now.toISOString()})));
    }
  };
}
