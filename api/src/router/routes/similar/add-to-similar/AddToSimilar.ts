import {similarRequestFrom} from "@src/router/routes/similar/shared/utils/SimilarRequestFrom";
import {respondEmpty} from "@src/router/respond/RespondEmpty";
import {saveSimilarWord} from "@src/database/similar/SaveSimilarWord";
import type {Account} from "@src/database/types/Account";

/** `POST /api/similar` with `{noteId, text}`: keeps a similar word with a note. Asking again for a word already kept is fine. */
export async function addToSimilar(request: Request, account: Account): Promise<Response> {
  const word = similarRequestFrom(await request.json().catch(() => undefined));

  if (!word) {
    return respondEmpty(400);
  }

  await saveSimilarWord({...word, userId: account.id, now: new Date()});

  return respondEmpty(204);
}
