import {openPictureDatabase} from "@src/redux/slices/card-pictures/indexed-db/OpenPictureDatabase";
import {PICTURE_STORE} from "@src/redux/slices/card-pictures/indexed-db/PictureStore";
import {transactionDone} from "@src/redux/shared/indexed-db/TransactionDone";

/** Forgets the card's picture. */
export async function forgetStoredPicture(cardId: string): Promise<void> {
  const database = await openPictureDatabase();
  const transaction = database.transaction(PICTURE_STORE, "readwrite");

  transaction.objectStore(PICTURE_STORE).delete(cardId);
  await transactionDone(transaction);
}
