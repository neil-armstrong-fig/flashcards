import {listSimilarWords} from "@src/database/similar/ListSimilarWords";
import {respondJson} from "@src/router/respond/RespondJson";
import type {Account} from "@src/database/types/Account";

/** `GET /api/similar`: the similar words this account has asked for, by the note each is kept with, oldest first. */
export async function readSimilar(account: Account): Promise<Response> {
  const words: Record<string, string[]> = {};

  for (const {noteId, text} of await listSimilarWords(account.id)) {
    words[noteId] = [...(words[noteId] ?? []), text];
  }

  return respondJson({words});
}
