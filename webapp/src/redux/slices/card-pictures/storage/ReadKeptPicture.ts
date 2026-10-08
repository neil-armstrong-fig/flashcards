import {openPictureDatabase} from "@src/redux/slices/card-pictures/indexed-db/OpenPictureDatabase";
import {PICTURE_STORE} from "@src/redux/slices/card-pictures/indexed-db/PictureStore";
import {readStoredPicture} from "@src/redux/slices/card-pictures/stored-picture/ReadStoredPicture";
import type {StoredPicture} from "@src/redux/slices/card-pictures/types/StoredPicture";

/** The picture kept on this device for a card, with the picture itself, or `undefined` where there is none. */
export async function readKeptPicture(cardId: string): Promise<StoredPicture | undefined> {
  const database = await openPictureDatabase();

  return readStoredPicture(await database.get(PICTURE_STORE, cardId));
}
