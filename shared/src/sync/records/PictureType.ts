/** The kinds of image kept online: the app re-encodes every picture to one of the first two before keeping it, and still takes a PNG it could not re-encode. */
export const PICTURE_TYPES = ["image/webp", "image/jpeg", "image/png"] as const;

export type PictureType = (typeof PICTURE_TYPES)[number];

/** Whether a name of a type is one of the kinds of image kept online. */
export function isPictureType(type: string): type is PictureType {
  return PICTURE_TYPES.some(known => known === type);
}
