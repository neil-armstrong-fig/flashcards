import {baseConfig, restrictedImports} from "@flashcards/shared/config/eslint.base.js";
import eslintReact from "@eslint-react/eslint-plugin";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";

const allowedPackages = ["@flashcards/shared", "@flashcards/content"];

/** The UI and state libraries, which the pure folders below must not reach for. */
const noUiOrStore = ["react", "react-dom", "react-redux", "@reduxjs/toolkit"].map(name => ({
  name,
  message:
    "This folder is plain TypeScript: no React and no Redux. The page and the store call into it, never the reverse.",
}));

/** The slices: each owns a piece of state, and its state and reducers may not know of another's. */
const SLICES = ["account", "browse", "card-notes", "card-pictures", "deck", "offline", "settings", "similar", "study"];

export default [
  ...baseConfig({tsconfigRootDir: import.meta.dirname, allowedPackages}),
  {
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        ecmaFeatures: {jsx: true},
      },
    },
    plugins: {
      ...eslintReact.configs["recommended-typescript"].plugins,
      "react-hooks": reactHooks,
    },
    settings: eslintReact.configs["recommended-typescript"].settings,
    rules: {
      ...eslintReact.configs["recommended-typescript"].rules,
      ...reactHooks.configs.recommended.rules,
      // eslint-plugin-react-hooks owns these; letting both report would double up.
      ...eslintReact.configs["disable-conflict-eslint-plugin-react-hooks"].rules,
      "no-restricted-imports": restrictedImports({allowedPackages}),
    },
  },
  {
    // State must not depend on views. Components read state through the typed hooks; a slice that reaches back into
    // `react/` would make the store impossible to test or reason about alone.
    files: ["src/redux/**"],
    rules: {
      // Flat config replaces this rule rather than merging it, so everything the block above contributes is repeated.
      "no-restricted-imports": restrictedImports({
        allowedPackages,
        patterns: [
          {
            group: ["@src/react", "@src/react/**"],
            message:
              "The redux layer must not import from react/. Components depend on state, not the other way round.",
          },
          {
            group: ["@src/audio", "@src/audio/**"],
            message:
              "The redux layer must not import from audio/. React puts the two together: state decides, audio speaks.",
          },
        ],
      }),
    },
  },
  {
    // The scheduling domain: when a card comes back, what is due today, which card is next. Plain functions over plain
    // data, with no clock of its own (a time is always passed in), so every rule is testable by calling it.
    files: ["src/spaced-repetition/**"],
    rules: {
      // Flat config replaces this rule rather than merging it, so the parent-import ban and boundary are repeated.
      "no-restricted-imports": restrictedImports({
        allowedPackages,
        paths: noUiOrStore,
        patterns: [
          {
            group: [
              "@src/react",
              "@src/react/**",
              "@src/redux",
              "@src/redux/**",
              "@src/audio",
              "@src/audio/**",
              "@src/storage/**",
              "@flashcards/content/**",
            ],
            message:
              "spaced-repetition/ knows nothing of the page, the store, the audio or the decks. They call it; it calls none of them.",
          },
        ],
      }),
    },
  },
  ...SLICES.map(slice => ({
    // A slice's state and reducers know nothing of another slice. Its thunks and selectors may read across (through the other's
    // selectors), and what changes several slices at once is in `redux/workflows/`.
    files: [
      `src/redux/slices/${slice}/*Slice.ts`,
      `src/redux/slices/${slice}/initial-state/**`,
      `src/redux/slices/${slice}/types/**`,
    ],
    rules: {
      // Flat config replaces this rule rather than merging it, so the react and audio bans above are repeated.
      "no-restricted-imports": restrictedImports({
        allowedPackages,
        patterns: [
          {
            group: ["@src/react", "@src/react/**"],
            message:
              "The redux layer must not import from react/. Components depend on state, not the other way round.",
          },
          {
            group: ["@src/audio", "@src/audio/**"],
            message:
              "The redux layer must not import from audio/. React puts the two together: state decides, audio speaks.",
          },
          {
            group: SLICES.filter(other => other !== slice).map(other => `@src/redux/slices/${other}/**`),
            message:
              "A slice's state and reducers know nothing of another slice. Pass what is needed in the action's payload, or put the code in redux/workflows/.",
          },
        ],
      }),
    },
  })),
  {
    // Recordings: fetching, keeping and playing them. Plain functions handed what they need as arguments (never the store), so the
    // page can put them beside state without either knowing of the other.
    files: ["src/audio/**"],
    rules: {
      // Flat config replaces this rule rather than merging it, so the parent-import ban and boundary are repeated.
      "no-restricted-imports": restrictedImports({
        allowedPackages,
        paths: noUiOrStore,
        patterns: [
          {
            group: [
              "@src/react",
              "@src/react/**",
              "@src/redux",
              "@src/redux/**",
              "@src/spaced-repetition/**",
              "@src/storage/**",
            ],
            message:
              "audio/ knows nothing of the page, the store or the schedule. Hand it values as arguments; React calls it.",
          },
        ],
      }),
    },
  },
  {
    // The device's storage: localStorage and IndexedDB behind plain functions. It owns every key, store name, version and stored
    // shape, so redux calls "read the settings" and "keep this answer" and knows nothing of how or where. It checks what it reads.
    files: ["src/storage/**"],
    rules: {
      // Flat config replaces this rule rather than merging it, so the parent-import ban and boundary are repeated.
      "no-restricted-imports": restrictedImports({
        allowedPackages,
        paths: noUiOrStore,
        patterns: [
          {
            group: ["@src/react", "@src/react/**", "@src/redux", "@src/redux/**", "@src/audio", "@src/audio/**"],
            message: "storage/ knows nothing of the page, the store or the audio. They call it; it calls none of them.",
          },
        ],
      }),
    },
  },
  {
    // What never varies while the page lives. Packages only, so anything may read it.
    files: ["src/environment/**"],
    rules: {
      // Flat config replaces this rule rather than merging it, so the parent-import ban and boundary are repeated.
      "no-restricted-imports": restrictedImports({
        allowedPackages,
        paths: noUiOrStore,
        patterns: [
          {
            group: ["@src/**"],
            message: "environment/ is the bottom of the app: it imports packages only, never another folder of src/.",
          },
        ],
      }),
    },
  },
];
