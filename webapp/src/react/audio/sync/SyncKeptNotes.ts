import {hasKeptAudio} from "@src/audio/kept/HasKeptAudio";
import {keepAudio} from "@src/audio/kept/KeepAudio";
import {startNotesSync} from "@src/redux/workflows/kept-notes/thunks/StartNotesSync";
import {syncKeptNote} from "@src/redux/workflows/kept-notes/thunks/SyncKeptNote";
import type {AppStore} from "@src/redux/Store";

/**
 * Makes the cards on this device the cards kept online, which are the truth. A card kept online that is not here is added once its
 * recordings are fetched (a card whose recordings this device lost has them fetched again, which costs nothing once the API has made
 * them). A card that cannot be fetched is skipped and tried again next time; nothing here ever blocks the learner.
 */
export async function syncKeptNotes(store: AppStore): Promise<void> {
  const kept = await store.dispatch(startNotesSync());

  if (kept === undefined) {
    return;
  }

  for (const note of kept) {
    const here = store.getState().deck.notes.some(each => each.id === note.id);

    try {
      if (!here || !(await hasKeptAudio("ko", note.word)) || !(await hasKeptAudio("en", note.meaning))) {
        await keepAudio("ko", note.word);
        await keepAudio("en", note.meaning);
      }
    } catch (error) {
      console.error("A kept card's recordings could not be fetched again.", error);
      continue;
    }

    store.dispatch(syncKeptNote(note));
  }
}
