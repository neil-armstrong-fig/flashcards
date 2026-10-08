import {openPictureDatabase} from "@src/storage/index-db/pictures/database/OpenPictureDatabase";
import {PICTURE_STORE} from "@src/storage/index-db/pictures/database/PictureStore";

/** Forgets the card's picture. */
export async function forgetStoredPicture(cardId: string): Promise<void> {
  const database = await openPictureDatabase();

  await database.delete(PICTURE_STORE, cardId);
}
