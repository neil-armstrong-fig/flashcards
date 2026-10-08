/**
 * Every route the API answers over HTTP, written as `<METHOD> <path>`. The one list: a route is matched only if it is here
 * (`httpRouteOf`), and answered only where `answerHttpRoute` has a case for it. A route in this list with no case is a compile
 * error, and one not in the list is never matched, so nothing falls through to a handler by being the last.
 */
export const HTTP_ROUTES = [
  "GET /api/auth/google",
  "GET /api/auth/google/callback",
  "POST /api/auth/logout",
  "GET /api/me",
  "POST /api/sync",
  "GET /api/pictures/*",
  "PUT /api/pictures/*",
  "GET /api/reminders/key",
  "PUT /api/reminders/subscription",
  "DELETE /api/reminders/subscription",
  "POST /api/reminders/goal-met",
  "POST /api/speech",
  "GET /api/audio/*",
] as const;
