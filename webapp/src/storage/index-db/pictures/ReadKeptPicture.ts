import {openPictureDatabase} from "@src/storage/index-db/pictures/database/OpenPictureDatabase";
import {PICTURE_STORE} from "@src/storage/index-db/pictures/database/PictureStore";
import {readStoredPicture} from "@src/storage/index-db/pictures/stored-picture/ReadStoredPicture";
import type {StoredPicture} from "@src/storage/index-db/pictures/types/StoredPicture";

/** The picture kept on this device for a card, with the picture itself, or `undefined` where there is none. */
export async function readKeptPicture(cardId: string): Promise<StoredPicture | undefined> {
  const database = await openPictureDatabase();

  return readStoredPicture(await database.get(PICTURE_STORE, cardId));
}
