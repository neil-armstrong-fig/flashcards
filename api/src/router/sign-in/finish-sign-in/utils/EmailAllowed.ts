import {listFrom} from "@src/router/cors/ListFrom";

/**
 * Whether this Google account may sign in: its email is on the list (`ALLOWED_EMAILS`), compared without regard to case, and Google
 * says it has checked it belongs to them. This is a private test app, so anybody else is turned away after Google has said who they are.
 */
export function emailAllowed(email: string | undefined, verified: boolean, setting: string | undefined): boolean {
  if (email === undefined || !verified) {
    return false;
  }

  return listFrom(setting).some(allowed => allowed.toLowerCase() === email.toLowerCase());
}
