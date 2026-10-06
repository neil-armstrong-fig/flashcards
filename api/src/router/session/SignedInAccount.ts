import {accountOfSession} from "@src/database/sessions/AccountOfSession";
import {hashSessionToken} from "@src/router/session/HashSessionToken";
import {headerOf} from "@src/router/request/HeaderOf";
import {sessionTokenFrom} from "@src/router/session/SessionTokenFrom";
import type {Account} from "@src/database/types/Account";

/** The account a request's session cookie belongs to, or undefined where it has none, or none that is still good. */
export async function signedInAccount(request: Request): Promise<Account | undefined> {
  const token = sessionTokenFrom(headerOf(request, "Cookie"));

  if (token === undefined) {
    return undefined;
  }

  return await accountOfSession(await hashSessionToken(token), new Date());
}
