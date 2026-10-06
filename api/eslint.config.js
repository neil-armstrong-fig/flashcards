import {baseConfig} from "@flashcards/shared/config/eslint.base.js";

// The Worker may import the vocabulary and the Azure voice tables from `@flashcards/shared`, and nothing else in the
// workspace. The webapp may not import this package at all: it is denied by default, there is no allow-list entry for it.
export default [
  // What `wrangler dev` builds and bundles is not ours to lint.
  {ignores: [".wrangler/**"]},
  ...baseConfig({tsconfigRootDir: import.meta.dirname, allowedPackages: ["@flashcards/shared"]}),
  {
    // No ternaries in the Worker: a guard that returns early reads one condition at a time (`AGENTS.md`).
    rules: {"no-ternary": "error"},
  },
];
