/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Where the speech API is, when the build is given one. Unset, the app looks for `wrangler dev` on this machine. */
  readonly VITE_API_ORIGIN?: string;
}
