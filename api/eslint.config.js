import {baseConfig} from "@language-learning/shared/config/eslint.base.js";

// The Worker may import the vocabulary and the Azure voice tables from `@language-learning/shared`, and nothing else in the
// workspace. The webapp may not import this package at all: it is denied by default, there is no allow-list entry for it.
export default [
  // What `wrangler dev` builds and bundles is not ours to lint.
  {ignores: [".wrangler/**"]},
  ...baseConfig({tsconfigRootDir: import.meta.dirname, allowedPackages: ["@language-learning/shared"]}),
  {
    // No ternaries in the Worker: a guard that returns early reads one condition at a time (`AGENTS.md`).
    rules: {"no-ternary": "error"},
  },
];
