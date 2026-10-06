import {respondJson} from "@src/router/respond/RespondJson";
import type {Account} from "@src/database/types/Account";

/** `GET /api/me`: who the session belongs to. */
export function readMe(account: Account): Response {
  return respondJson({email: account.email});
}
