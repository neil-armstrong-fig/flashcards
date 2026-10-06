import * as oauth from "oauth4webapi";
import {GOOGLE} from "@src/router/sign-in/shared/google/GoogleEndpoints";
import {workerEnvironment} from "@src/env/WorkerEnvironment";
import type {GoogleAuthorization} from "@src/router/sign-in/shared/google/types/GoogleAuthorization";

/**
 * Where to send a person to sign in with Google: its consent screen, asking for the OAuth 2.0 authorization-code flow with PKCE
 * and the scopes `openid` and `email`, so Google tells the API a stable id and the address to check against the allow-list, and
 * nothing else (no name, no profile).
 */
export async function googleAuthorizationUrl({state, codeVerifier, redirectUri}: GoogleAuthorization): Promise<URL> {
  const url = new URL(GOOGLE.authorization_endpoint ?? "");

  url.searchParams.set("client_id", workerEnvironment.GOOGLE_OAUTH_CLIENT_ID);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid email");
  url.searchParams.set("state", state);
  url.searchParams.set("code_challenge", await oauth.calculatePKCECodeChallenge(codeVerifier));
  url.searchParams.set("code_challenge_method", "S256");

  return url;
}
