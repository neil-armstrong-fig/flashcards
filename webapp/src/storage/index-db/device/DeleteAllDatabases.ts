import {deleteDB} from "idb";

const GIVE_UP_AFTER_MS = 2_000;

/**
 * Deletes every IndexedDB database this origin holds: the study progress, the pictures, the sync logs. The app's own open connections
 * close themselves when a database asks (`blocking` in each `Open…Database`). A connection that does not, in another tab, would hold a
 * deletion for ever, so each is given a moment: the browser finishes a deletion left waiting once the connection goes, and the page
 * reloads regardless. A failure is reported and ignored: the learner carries on.
 */
export async function deleteAllDatabases(): Promise<void> {
  try {
    for (const {name} of await indexedDB.databases()) {
      if (name !== undefined) {
        await Promise.race([deleteDB(name), pause()]);
      }
    }
  } catch (error) {
    console.error("The databases kept on this device could not be deleted.", error);
  }
}

async function pause(): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, GIVE_UP_AFTER_MS));
}
