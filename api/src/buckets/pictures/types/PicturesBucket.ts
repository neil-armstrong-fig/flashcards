import type {StoredPicture} from "@src/buckets/pictures/types/StoredPicture";

/** The part of an R2 bucket the Worker uses for pictures, so a test can stand in for it without building R2's whole object type. */
export interface PicturesBucket {
  get(key: string): Promise<StoredPicture | null>;
  put(
    key: string,
    value: ArrayBuffer,
    options: {readonly httpMetadata: {readonly contentType: string}},
  ): Promise<unknown>;
}
