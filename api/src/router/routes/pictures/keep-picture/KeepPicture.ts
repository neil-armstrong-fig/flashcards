import {MAX_PICTURE_BYTES} from "@src/router/routes/pictures/shared/utils/MaxPictureBytes";
import {PICTURE_TYPES} from "@flashcards/shared/sync/records/PictureType";
import {pictureHashFrom} from "@src/router/routes/pictures/shared/utils/PictureHashFrom";
import {pictureKeyOf} from "@src/router/routes/pictures/shared/utils/PictureKeyOf";
import {respondEmpty} from "@src/router/respond/RespondEmpty";
import {sha256Hex} from "@src/router/routes/pictures/keep-picture/utils/Sha256Hex";
import {workerEnvironment} from "@src/env/WorkerEnvironment";
import type {Account} from "@src/database/types/Account";

/**
 * `PUT /api/pictures/<hash>`: keeps a picture's bytes, for this account, under the hash they were sent under. The hash is checked
 * against the bytes, so a hash names exactly one picture and can be trusted; a picture that is already there is kept again, which
 * changes nothing. 404 for a name that is not a hash, 400 for a type that is not a picture or bytes that are not the hash, and 413
 * past the ceiling.
 */
export async function keepPicture(request: Request, account: Account): Promise<Response> {
  const hash = pictureHashFrom(new URL(request.url).pathname);
  const type = request.headers.get("Content-Type") ?? undefined;

  if (hash === undefined) {
    return respondEmpty(404);
  }

  if (!PICTURE_TYPES.some(known => known === type)) {
    return respondEmpty(400);
  }

  if (Number(request.headers.get("Content-Length")) > MAX_PICTURE_BYTES) {
    return respondEmpty(413);
  }

  const bytes = await request.arrayBuffer();

  if (bytes.byteLength > MAX_PICTURE_BYTES) {
    return respondEmpty(413);
  }

  if ((await sha256Hex(bytes)) !== hash) {
    return respondEmpty(400);
  }

  await workerEnvironment.PICTURES.put(pictureKeyOf(account.id, hash), bytes, {
    httpMetadata: {contentType: type ?? ""},
  });

  return respondEmpty(204);
}
