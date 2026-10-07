/** Where each screen is, as a hash route (`#/settings`): a typed value to link to, never a string written out at the link. */
export const ROUTES = {
  home: "/",
  settings: "/settings",
  deckSettings: "/settings/deck/:deckId",
  browse: "/browse",
  struggling: "/struggling",
  review: "/review",
} as const;
