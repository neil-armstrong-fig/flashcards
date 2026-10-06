# AGENTS.md: shared

Two jobs: `config/` holds the base tool configuration every package extends, and `src/` holds what more than one package needs.

## The vocabulary

`src/` is the words the app is described in, here rather than in the webapp because **the acceptance tests need the same
words**: a spec that asserted `"gud"` instead of `"good"` would compile, run, and quietly never match.

```
src/study/      Rating (again, hard, good, easy, read off one list), StudyFocus (all, new or struggling: which part of a deck's day a session studies)
src/http/       ByteRangeFrom: what a `Range` header asks for, used by the API to answer it and by the app's service worker to answer from a cached copy
src/theme/      Theme (system, light or dark: the learner's choice of colours, read off one list)
src/audio/      Voice and Speed (the learner's two choices, each read off one list), RecordingVariant (`female-slower`)
src/language/   Language (the languages taught, by ISO code; Japanese and Dutch join as their phases land), the checks on what a learner
                types (KoreanText, EnglishText, RomanisationText) and RomanisationOf (the Revised Romanization of a word, by `koroman`, the one dependency here)
```

Reach for `shared` where a thing is a **contract between packages**, not wherever code happens to repeat. Behaviour belongs in
the webapp (`src/spaced-repetition/`), not here: `acceptance-tests` can import anything in this package, and a spec that
recomputed its expected outcome from the code under test would agree with it whatever either of them did.

## Rules of the package

- **Change a lint, format, tsconfig or vitest rule here, not in a package.** Packages extend these files, so editing a package
  copy makes the rule inconsistent. A package's `eslint.config.js` must call
  `baseConfig({tsconfigRootDir: import.meta.dirname, ...})` or it throws: the editor runs one ESLint server for the whole
  workspace and, without an explicit root, mixes up which package a file belongs to.
- `src/` is consumed as raw TypeScript through the `exports` map. There is no build step: do not add one. Anything here is
  imported as `@language-learning/shared/<path>`, and one folder inside reaches another by that same name (a sibling as
  `./X`), because `../` is refused and an `@src` alias would resolve into the importing package.
- Pure functions and plain types only. Nothing that touches the DOM, Playwright, Redux or React.
- **`koroman` is the package's one external dependency** (`docs/romanisation.md`); keep to pure functions and add another only for a reason as good.
- **This package may not import any other workspace package.** It is the bottom of the dependency graph and lint enforces it.
  If something here needs `webapp` or `acceptance-tests`, it does not belong in `shared`.
- A union of literals is declared once from an `as const` list here (`RATINGS`), so the app and the specs cannot drift.
