import {listNotes} from "@src/database/notes/ListNotes";
import {respondJson} from "@src/router/respond/RespondJson";
import type {Account} from "@src/database/types/Account";

/** `GET /api/notes`: the cards this account has made, oldest first. */
export async function readNotes(account: Account): Promise<Response> {
  return respondJson({notes: await listNotes(account.id)});
}
