import {isPictureType} from "@flashcards/shared/sync/records/PictureType";
import {LONGEST_PICTURE_SIDE} from "@src/redux/slices/card-pictures/limits/LongestPictureSide";
import {MAXIMUM_KEPT_PICTURE_BYTES} from "@src/redux/slices/card-pictures/limits/MaximumKeptPictureBytes";
import type {ProcessedPicture} from "@src/redux/slices/card-pictures/picture-processing/types/ProcessedPicture";

const KINDS_TO_TRY = ["image/webp", "image/jpeg"] as const;
const QUALITIES = [0.82, 0.65, 0.45];

/**
 * Makes a chosen file ready to keep, here on the device, so a picture added with no signal is as small as one added with it: drawn on
 * a canvas no larger than `LONGEST_PICTURE_SIDE` along its longer side (never enlarged) and encoded again as WebP, or as JPEG where the
 * browser cannot make WebP, at the best quality that fits `MAXIMUM_KEPT_PICTURE_BYTES`. A file the browser cannot read as a picture is refused,
 * and so is one that cannot be made small enough. Browser APIs throughout, so it is not run in unit tests (`SetupWebappTests` stands in for it).
 */
export async function processPicture(file: Blob): Promise<ProcessedPicture> {
  const bitmap = await createImageBitmap(file).catch(() => undefined);

  if (bitmap === undefined) {
    return {refusal: "That file is not a picture."};
  }

  const scale = Math.min(1, LONGEST_PICTURE_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = new OffscreenCanvas(
    Math.max(1, Math.round(bitmap.width * scale)),
    Math.max(1, Math.round(bitmap.height * scale)),
  );

  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  for (const type of KINDS_TO_TRY) {
    for (const quality of QUALITIES) {
      const encoded = await canvas.convertToBlob({type, quality});

      // A browser that cannot make this kind hands back a PNG instead: try the next kind.
      if (encoded.type !== type) {
        break;
      }

      if (encoded.size <= MAXIMUM_KEPT_PICTURE_BYTES && isPictureType(encoded.type)) {
        return {picture: encoded};
      }
    }
  }

  return {refusal: "That picture is too big to keep. Try a smaller one."};
}
