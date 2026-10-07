/** A picture as the bucket hands it back: its bytes, and the type it was kept with. */
export interface StoredPicture {
  readonly body: BodyInit;
  readonly httpMetadata?: {readonly contentType?: string};
}
