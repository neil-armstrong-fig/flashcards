import {openPictureDatabase} from "@src/redux/slices/card-pictures/indexed-db/OpenPictureDatabase";
import {PICTURE_STORE} from "@src/redux/slices/card-pictures/indexed-db/PictureStore";
import {readStoredPicture} from "@src/redux/slices/card-pictures/stored-picture/ReadStoredPicture";
import {requestResult} from "@src/redux/shared/indexed-db/RequestResult";
import {transactionDone} from "@src/redux/shared/indexed-db/TransactionDone";
import type {StoredPicture} from "@src/redux/slices/card-pictures/types/StoredPicture";

/** Dates a picture kept already afresh, because the learner chose to keep it a while longer. Gives the picture, or `undefined` where there was none. */
export async function renewStoredPicture(cardId: string, addedAt: string): Promise<Blob | undefined> {
  const database = await openPictureDatabase();
  const transaction = database.transaction(PICTURE_STORE, "readwrite");
  const store = transaction.objectStore(PICTURE_STORE);
  const record = readStoredPicture(await requestResult<unknown>(store.get(cardId)));

  if (record !== undefined) {
    store.put({picture: record.picture, addedAt} satisfies StoredPicture, cardId);
  }

  await transactionDone(transaction);

  return record?.picture;
}
