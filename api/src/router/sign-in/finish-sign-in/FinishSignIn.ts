import {clearedOauthCookie} from "@src/router/sign-in/shared/oauth/ClearedOauthCookie";
import {clientOf} from "@src/router/sign-in/shared/utils/ClientOf";
import {createSession} from "@src/database/sessions/CreateSession";
import {emailAllowed} from "@src/router/sign-in/finish-sign-in/utils/EmailAllowed";
import {findOrCreateAccount} from "@src/database/accounts/FindOrCreateAccount";
import {googleIdentityOf} from "@src/router/sign-in/shared/google/GoogleIdentityOf";
import {googleRedirectUri} from "@src/router/sign-in/shared/google/GoogleRedirectUri";
import {hashSessionToken} from "@src/router/session/HashSessionToken";
import {loginAllowed} from "@src/router/sign-in/shared/utils/LoginAllowed";
import {headerOf} from "@src/router/request/HeaderOf";
import {parameterOf} from "@src/router/request/ParameterOf";
import {oauthAttemptFrom} from "@src/router/sign-in/shared/oauth/OAuthAttemptFrom";
import {randomToken} from "@src/router/session/RandomToken";
import {respondEmpty} from "@src/router/respond/RespondEmpty";
import {respondRedirect} from "@src/router/respond/RespondRedirect";
import {SESSION_LIFETIME_SECONDS} from "@src/router/session/SessionLifetime";
import {sessionCookie} from "@src/router/session/cookie/SessionCookie";
import {workerEnvironment} from "@src/env/WorkerEnvironment";

/**
 * `GET /api/auth/google/callback`: Google sending the person back. The attempt must be one this API started (the state in the
 * cookie is the one that came back), Google must say who the person is, and that must be an email on the allow-list; then they are
 * given a session, and a new account if Google's id has none.
 *
 * Whatever goes wrong, the person is sent back to the app with no session rather than shown an error page here: the app asks who
 * they are, hears nobody, and is signed out, which is the true state of things. The reason is logged.
 */
export async function finishSignIn(request: Request): Promise<Response> {
  if (!(await loginAllowed(clientOf(request)))) {
    return respondEmpty(429);
  }

  const attempt = oauthAttemptFrom(headerOf(request, "Cookie"));

  if (attempt === undefined) {
    console.error("Sign-in refused: the callback carried no attempt cookie, so it is not one this API started.");

    return respondEmpty(400);
  }

  const parameters = new URL(request.url).searchParams;
  const code = parameterOf(parameters, "code");
  const failed = respondRedirect(attempt.returnTo, [clearedOauthCookie()]);

  if (code === undefined || parameterOf(parameters, "state") !== attempt.state) {
    console.error(`Sign-in refused: ${refusalReason(parameters)}.`);

    return failed;
  }

  try {
    const identity = await googleIdentityOf({
      code,
      state: attempt.state,
      codeVerifier: attempt.codeVerifier,
      redirectUri: googleRedirectUri(request),
    });

    if (
      !emailAllowed(identity.email, identity.emailVerified, workerEnvironment.ALLOWED_EMAILS) ||
      identity.email === undefined
    ) {
      console.error("Sign-in refused: that Google account is not on the allow-list.");

      return failed;
    }

    const now = new Date();
    const account = await findOrCreateAccount(identity.subject, {id: crypto.randomUUID(), email: identity.email, now});
    const token = randomToken();

    await createSession({
      idHash: await hashSessionToken(token),
      userId: account.id,
      expiresAt: new Date(now.getTime() + SESSION_LIFETIME_SECONDS * 1000),
    });

    return respondRedirect(attempt.returnTo, [sessionCookie(token), clearedOauthCookie()]);
  } catch (error) {
    // Said where only the Worker's own logs can see it: why Google or the database refused is what somebody setting this up needs,
    // and the person, sent back signed out, can do nothing with it. Nothing secret is in an error from either.
    console.error("Sign-in failed:", error);

    return failed;
  }
}

/** Why a sign-in was turned away: Google sent no code, or the state it sent back was not the one this person started with. */
function refusalReason(parameters: URLSearchParams): string {
  if (parameterOf(parameters, "code") === undefined) {
    return `Google sent no code (error: ${parameterOf(parameters, "error") ?? "none"})`;
  }

  return "the state did not match";
}
