import {pictureHashFrom} from "@src/router/routes/pictures/shared/utils/PictureHashFrom";
import {pictureKeyOf} from "@src/router/routes/pictures/shared/utils/PictureKeyOf";
import {respondEmpty} from "@src/router/respond/RespondEmpty";
import {workerEnvironment} from "@src/env/WorkerEnvironment";
import type {Account} from "@src/database/types/Account";

/** `GET /api/pictures/<hash>`: a picture this account kept. The same hash always gives the same bytes, so the browser may keep it for good. */
export async function servePicture(request: Request, account: Account): Promise<Response> {
  const hash = pictureHashFrom(new URL(request.url).pathname);

  if (hash === undefined) {
    return respondEmpty(404);
  }

  const picture = await workerEnvironment.PICTURES.get(pictureKeyOf(account.id, hash));

  if (picture === null) {
    return respondEmpty(404);
  }

  return new Response(picture.body, {
    headers: {
      "Content-Type": picture.httpMetadata?.contentType ?? "application/octet-stream",
      "Cache-Control": "private, max-age=31536000, immutable",
    },
  });
}
