import type {DBSchema} from "idb";

/** The pictures database as `idb` types it: one value per card id, `unknown` until `readStoredPicture` has checked it. */
export interface PictureDatabase extends DBSchema {
  pictures: {key: string; value: unknown};
}
