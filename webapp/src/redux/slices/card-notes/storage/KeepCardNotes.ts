import {CARD_NOTES_STORAGE_KEY} from "@src/redux/slices/card-notes/storage/CardNotesStorageKey";
import {saveJson} from "@src/redux/shared/device-storage/SaveJson";
import type {RootState} from "@src/redux/Store";
import type {Store, UnknownAction} from "@reduxjs/toolkit";

/** Writes the notes to the device each time they change, and only then. */
export function keepCardNotes(store: Store<RootState, UnknownAction>): void {
  let kept = store.getState().cardNotes;

  store.subscribe(() => {
    const notes = store.getState().cardNotes;

    if (notes === kept) {
      return;
    }

    kept = notes;
    saveJson(CARD_NOTES_STORAGE_KEY, {byCard: notes.byCard, addedAt: notes.addedAt});
  });
}
