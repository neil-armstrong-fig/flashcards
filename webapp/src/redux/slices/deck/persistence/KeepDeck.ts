import {keepStoredDeck} from "@src/storage/local-storage/deck/KeepStoredDeck";
import type {RootState} from "@src/redux/Store";
import type {Store, UnknownAction} from "@reduxjs/toolkit";

/** Writes the cards the learner made to the device each time they change, and only then. Whether a fetch is under way is not kept. */
export function keepDeck(store: Store<RootState, UnknownAction>): void {
  let kept = store.getState().deck.notes;

  store.subscribe(() => {
    const {notes} = store.getState().deck;

    if (notes === kept) {
      return;
    }

    kept = notes;
    keepStoredDeck({notes});
  });
}
