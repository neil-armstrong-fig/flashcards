import {allowedOrigins} from "@src/router/cors/AllowedOrigins";
import {clientOf} from "@src/router/sign-in/shared/utils/ClientOf";
import {googleAuthorizationUrl} from "@src/router/sign-in/shared/google/GoogleAuthorizationUrl";
import {googleRedirectUri} from "@src/router/sign-in/shared/google/GoogleRedirectUri";
import {loginAllowed} from "@src/router/sign-in/shared/utils/LoginAllowed";
import {oauthCookie} from "@src/router/sign-in/shared/oauth/OAuthCookie";
import {randomToken} from "@src/router/session/RandomToken";
import {respondEmpty} from "@src/router/respond/RespondEmpty";
import {respondRedirect} from "@src/router/respond/RespondRedirect";
import {parameterOf} from "@src/router/request/ParameterOf";
import {returnAddress} from "@src/router/sign-in/start-sign-in/utils/ReturnAddress";

/**
 * `GET /api/auth/google`: sends the person to Google, holding this attempt in a short-lived cookie so the callback can tell it from
 * one somebody else started. Where the app asked to be brought back to is kept with it, once checked.
 */
export async function startSignIn(request: Request): Promise<Response> {
  if (!(await loginAllowed(clientOf(request)))) {
    return respondEmpty(429);
  }

  const state = randomToken();
  const codeVerifier = randomToken();
  const returnTo = returnAddress(parameterOf(new URL(request.url).searchParams, "return"), allowedOrigins());
  const authorization = await googleAuthorizationUrl({state, codeVerifier, redirectUri: googleRedirectUri(request)});

  return respondRedirect(authorization.href, [oauthCookie({state, codeVerifier, returnTo})]);
}
