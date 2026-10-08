import {openPictureDatabase} from "@src/redux/slices/card-pictures/indexed-db/OpenPictureDatabase";
import {PICTURE_STORE} from "@src/redux/slices/card-pictures/indexed-db/PictureStore";
import {readStoredPicture} from "@src/redux/slices/card-pictures/stored-picture/ReadStoredPicture";
import type {KeptPicture} from "@src/redux/slices/card-pictures/types/KeptPicture";

/**
 * Every picture the learner put on a card, kept on this device, by card id. A picture is a `Blob`, which is not plain data, so the
 * store holds only an address to show it by (`blob:`). A picture that cannot be read is left out.
 */
export async function loadStoredPictures(): Promise<Readonly<Record<string, KeptPicture>>> {
  const database = await openPictureDatabase();
  const [keys, values] = await Promise.all([database.getAllKeys(PICTURE_STORE), database.getAll(PICTURE_STORE)]);
  const pictures: Record<string, KeptPicture> = {};

  keys.forEach((key, index) => {
    const record = readStoredPicture(values[index]);

    if (typeof key === "string" && record !== undefined) {
      pictures[key] = {address: URL.createObjectURL(record.picture), addedAt: record.addedAt};
    }
  });

  return pictures;
}
