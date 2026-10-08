import {openPictureDatabase} from "@src/redux/slices/card-pictures/indexed-db/OpenPictureDatabase";
import {PICTURE_STORE} from "@src/redux/slices/card-pictures/indexed-db/PictureStore";

/** Forgets the card's picture. */
export async function forgetStoredPicture(cardId: string): Promise<void> {
  const database = await openPictureDatabase();

  await database.delete(PICTURE_STORE, cardId);
}
