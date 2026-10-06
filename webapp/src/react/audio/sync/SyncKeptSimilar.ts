import {hasKeptAudio} from "@src/audio/kept/HasKeptAudio";
import {keepAudio} from "@src/audio/kept/KeepAudio";
import {readKeptSimilar} from "@src/redux/api/ReadKeptSimilar";
import {wordAdded} from "@src/redux/slices/similar/SimilarSlice";
import type {AppStore} from "@src/redux/Store";

/**
 * Brings the similar words kept online down to this device: any that are not here yet, or whose recordings this device no longer has (a
 * new phone, cleared site data), are added and their recordings fetched again, which costs nothing once the API has made them. A word that
 * cannot be fetched is skipped and tried again next time; nothing here ever blocks the learner.
 */
export async function syncKeptSimilar(store: AppStore): Promise<void> {
  let kept;

  try {
    kept = await readKeptSimilar();
  } catch (error) {
    console.error("The kept similar words could not be read.", error);

    return;
  }

  for (const [noteId, texts] of Object.entries(kept)) {
    for (const text of texts) {
      const here = store.getState().similar.words[noteId]?.includes(text) === true;

      if (here && (await hasKeptAudio("ko", text))) {
        continue;
      }

      try {
        await keepAudio("ko", text);
      } catch (error) {
        console.error("A kept similar word could not be fetched again.", error);
        continue;
      }

      if (!here) {
        store.dispatch(wordAdded({noteId, text}));
      }
    }
  }
}
