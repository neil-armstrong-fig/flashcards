import {similarRequestFrom} from "@src/router/routes/similar/shared/utils/SimilarRequestFrom";
import {deleteSimilarWord} from "@src/database/similar/DeleteSimilarWord";
import {respondEmpty} from "@src/router/respond/RespondEmpty";
import type {Account} from "@src/database/types/Account";

/** `DELETE /api/similar` with `{noteId, text}`: removes a similar word from a note. Removing one that is not there is fine. */
export async function removeFromSimilar(request: Request, account: Account): Promise<Response> {
  const word = similarRequestFrom(await request.json().catch(() => undefined));

  if (!word) {
    return respondEmpty(400);
  }

  await deleteSimilarWord(account.id, word);

  return respondEmpty(204);
}
