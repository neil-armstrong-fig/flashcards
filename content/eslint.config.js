import {baseConfig, restrictedImports} from "@flashcards/shared/config/eslint.base.js";

const allowedPackages = ["@flashcards/shared", "@flashcards/content"];

/** The UI and state libraries, which a folder of plain data must not reach for. */
const noUiOrStore = ["react", "react-dom", "react-redux", "@reduxjs/toolkit"].map(name => ({
  name,
  message: "content/ is plain TypeScript and data: no React and no Redux.",
}));

// Content is compiled as raw source by whoever imports it (the webapp, the audio tool), so a folder reaches another by the
// package's own name, never by an `@src` alias that would resolve into the importer's tree. It may import `shared`, and
// nothing else in the workspace: the app, the specs and the tools all sit above it.
export default [
  ...baseConfig({tsconfigRootDir: import.meta.dirname, allowedPackages}),
  {
    files: ["src/**"],
    rules: {
      "no-restricted-imports": restrictedImports({allowedPackages, paths: noUiOrStore}),
    },
  },
];
