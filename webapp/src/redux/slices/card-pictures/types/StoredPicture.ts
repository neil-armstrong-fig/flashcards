/** A picture as the device's database holds it: the picture itself and when it was added or last renewed (an ISO timestamp). */
export interface StoredPicture {
  readonly picture: Blob;
  readonly addedAt: string;
}
