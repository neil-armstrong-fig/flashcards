import {openPictureDatabase} from "@src/redux/slices/card-pictures/indexed-db/OpenPictureDatabase";
import {PICTURE_STORE} from "@src/redux/slices/card-pictures/indexed-db/PictureStore";
import type {StoredPicture} from "@src/redux/slices/card-pictures/types/StoredPicture";

/** Keeps the picture for the card on this device, replacing any it had, and gives the address to show it by. `addedAt` is an ISO timestamp. */
export async function storePicture(cardId: string, picture: Blob, addedAt: string): Promise<string> {
  const database = await openPictureDatabase();

  await database.put(PICTURE_STORE, {picture, addedAt} satisfies StoredPicture, cardId);

  return URL.createObjectURL(picture);
}
