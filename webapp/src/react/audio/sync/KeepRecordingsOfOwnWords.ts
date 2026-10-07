import {hasKeptAudio} from "@src/audio/kept/HasKeptAudio";
import {keepAudio} from "@src/audio/kept/KeepAudio";
import type {AppStore} from "@src/redux/Store";

/**
 * Fetches the recordings of the learner's own words that this device does not have: the cards and similar words their other devices made
 * and sync has just brought here, and any this device lost (a new phone, cleared site data, signing out). The API makes a recording once and keeps it, so
 * fetching one again costs nothing. A word that cannot be fetched is skipped and tried again next time; nothing here ever blocks the learner.
 */
export async function keepRecordingsOfOwnWords(store: AppStore): Promise<void> {
  for (const note of store.getState().deck.notes) {
    try {
      if (!(await hasKeptAudio("ko", note.word)) || !(await hasKeptAudio("en", note.meaning))) {
        await keepAudio("ko", note.word);
        await keepAudio("en", note.meaning);
      }
    } catch (error) {
      console.error("A card's recordings could not be fetched.", error);
    }
  }

  for (const texts of Object.values(store.getState().similar.words)) {
    for (const text of texts) {
      try {
        if (!(await hasKeptAudio("ko", text))) {
          await keepAudio("ko", text);
        }
      } catch (error) {
        console.error("A similar word's recording could not be fetched.", error);
      }
    }
  }
}
