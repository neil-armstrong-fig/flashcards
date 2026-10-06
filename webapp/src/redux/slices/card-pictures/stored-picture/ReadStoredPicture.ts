import type {StoredPicture} from "@src/redux/slices/card-pictures/types/StoredPicture";

/** What is read back is untrusted: a record is a picture and a date, or (from before pictures were dated) a bare picture. */
export function readStoredPicture(stored: unknown): StoredPicture | undefined {
  if (stored instanceof Blob) {
    return {picture: stored, addedAt: ""};
  }

  if (typeof stored !== "object" || stored === null || !("picture" in stored) || !(stored.picture instanceof Blob)) {
    return undefined;
  }

  if (!("addedAt" in stored) || typeof stored.addedAt !== "string") {
    return {picture: stored.picture, addedAt: ""};
  }

  return {picture: stored.picture, addedAt: stored.addedAt};
}
