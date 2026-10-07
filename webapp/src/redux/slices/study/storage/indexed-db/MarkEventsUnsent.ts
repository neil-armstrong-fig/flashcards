import {STUDY_STORES} from "@src/redux/slices/study/storage/indexed-db/StudyStores";

/** Part of upgrading a database that already holds events, from before there was a copy to send: every one is still to be sent, and sending twice is harmless. */
export function markEventsUnsent(upgrade: IDBTransaction): void {
  const request = upgrade.objectStore(STUDY_STORES.events).getAll();

  request.onsuccess = (): void => {
    for (const event of request.result as unknown[]) {
      upgrade.objectStore(STUDY_STORES.unsent).put(event);
    }
  };
}
