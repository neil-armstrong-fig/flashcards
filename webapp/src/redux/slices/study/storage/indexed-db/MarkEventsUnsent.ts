import {STUDY_STORES} from "@src/redux/slices/study/storage/indexed-db/StudyStores";
import type {StudyTransaction} from "@src/redux/slices/study/storage/indexed-db/types/StudyTransaction";

/** Part of upgrading a database that already holds events, from before there was a copy to send: every one is still to be sent, and sending twice is harmless. */
export async function markEventsUnsent(upgrade: StudyTransaction): Promise<void> {
  const events = await upgrade.objectStore(STUDY_STORES.events).getAll();

  await Promise.all(events.map(event => upgrade.objectStore(STUDY_STORES.unsent).put(event)));
}
