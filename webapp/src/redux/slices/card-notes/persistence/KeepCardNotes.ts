import {keepStoredCardNotes} from "@src/storage/local-storage/card-notes/KeepStoredCardNotes";
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
    keepStoredCardNotes({byCard: notes.byCard, addedAt: notes.addedAt});
  });
}
