import {runtime} from "@src/environment/Runtime";

/** Leaves the app for Google's sign-in, which brings the learner back to the app, at its start and not at the screen they were on, signed in. */
export function redirectToSignIn(): void {
  location.assign(
    `${runtime.apiOrigin}/api/auth/google?return=${encodeURIComponent(location.href.split("#")[0] ?? location.href)}`,
  );
}
