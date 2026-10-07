import {applyMemoryNoteRecord} from "@src/redux/workflows/sync/records/ApplyMemoryNoteRecord";
import {applyNoteRecord} from "@src/redux/workflows/sync/records/ApplyNoteRecord";
import {applyPictureRecord} from "@src/redux/workflows/sync/records/ApplyPictureRecord";
import {applySimilarRecord} from "@src/redux/workflows/sync/records/ApplySimilarRecord";
import {isLaterChoice} from "@flashcards/shared/sync/IsLaterChoice";
import {keepHeardRecord} from "@src/redux/workflows/sync/storage/records/KeepHeardRecord";
import {readLocalRecord} from "@src/redux/workflows/sync/storage/records/ReadLocalRecord";
import type {AppThunk} from "@src/redux/shared/AppThunk";
import type {RecordChange} from "@flashcards/shared/sync/records/RecordChange";

/**
 * Takes in what the learner made, changed or removed on their other devices, in the order the API heard of it. A change is taken
 * unless this device knows of a later one to that thing, so a change made here after another device's wins. Taking one is
 * idempotent, so the learner's own changes, which come back, change nothing, and a device that has lost what the screen showed (but kept
 * what it has heard) is put right by the same changes again. One that cannot be taken in (a picture that cannot be fetched) stops the rest, and
 * is tried again with them on the next sync.
 */
export function applyPulledRecords(changes: readonly RecordChange[]): AppThunk<Promise<void>> {
  return async dispatch => {
    for (const change of changes) {
      const known = await readLocalRecord(change.kind, change.id);

      if (known !== undefined && isLaterChoice(known.at, change.at)) {
        continue;
      }

      await dispatch(applyRecord(change));
      await keepHeardRecord(change);
    }
  };
}

function applyRecord(change: RecordChange): AppThunk<Promise<void>> {
  return async dispatch => {
    if (change.kind === "note") {
      await dispatch(applyNoteRecord(change));
    }

    if (change.kind === "similar") {
      dispatch(applySimilarRecord(change));
    }

    if (change.kind === "memory-note") {
      dispatch(applyMemoryNoteRecord(change));
    }

    if (change.kind === "picture") {
      await dispatch(applyPictureRecord(change));
    }
  };
}
