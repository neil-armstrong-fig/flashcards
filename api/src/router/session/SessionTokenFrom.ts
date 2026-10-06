import {SESSION_COOKIE} from "@src/router/session/cookie/SessionCookieName";

/** The session token in a request's `Cookie` header, or undefined where it carries none. */
export function sessionTokenFrom(cookieHeader: string | undefined): string | undefined {
  const pairs = (cookieHeader ?? "").split(";").map(pair => pair.trim());
  const token = pairs.find(pair => pair.startsWith(`${SESSION_COOKIE}=`))?.slice(SESSION_COOKIE.length + 1);

  if (!token) {
    return undefined;
  }

  return token;
}
