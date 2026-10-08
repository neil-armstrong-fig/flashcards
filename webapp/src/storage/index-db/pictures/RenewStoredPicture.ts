import {openPictureDatabase} from "@src/storage/index-db/pictures/database/OpenPictureDatabase";
import {PICTURE_STORE} from "@src/storage/index-db/pictures/database/PictureStore";
import {readStoredPicture} from "@src/storage/index-db/pictures/stored-picture/ReadStoredPicture";
import type {StoredPicture} from "@src/storage/index-db/pictures/types/StoredPicture";

/** Dates a picture kept already afresh, because the learner chose to keep it a while longer. Gives the picture, or `undefined` where there was none. */
export async function renewStoredPicture(cardId: string, addedAt: string): Promise<Blob | undefined> {
  const database = await openPictureDatabase();
  const transaction = database.transaction(PICTURE_STORE, "readwrite");
  const store = transaction.objectStore(PICTURE_STORE);
  const record = readStoredPicture(await store.get(cardId));

  if (record === undefined) {
    await transaction.done;

    return undefined;
  }

  await Promise.all([store.put({picture: record.picture, addedAt} satisfies StoredPicture, cardId), transaction.done]);

  return record.picture;
}
