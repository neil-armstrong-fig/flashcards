import {baseConfig, restrictedImports} from "@flashcards/shared/config/eslint.base.js";

const acceptanceCriteriaMapping = "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

const playwrightPackages = ["@playwright/test", "playwright", "playwright-core"];

const sharedPackage = "@flashcards/shared";

/**
 * Inside a `then`, a call on the DSL fixture (`webApp.x()`, `webApp.area.x()`, `webApp.area.sub.x()`) must be a question:
 * `get…`, `is…` or `can…`. Anything else is an action, and an action is arrangement that belongs in a `beforeEach`.
 *
 * This is the inverse of listing every action verb: a new DSL action is refused in a `then` by default, with nothing to
 * keep in step. Expect matchers are not calls on the fixture, so they are untouched.
 */
const notAQuestion = "[callee.property.name!=/^(get|is|can)[A-Z]/]";
const thenMakesNoAction = ["callee.object.name", "callee.object.object.name", "callee.object.object.object.name"]
  .map(path => `CallExpression[callee.name="then"] CallExpression${notAQuestion}[${path}="webApp"]`)
  .join(", ");

export default [
  ...baseConfig({tsconfigRootDir: import.meta.dirname, allowedPackages: [sharedPackage]}),
  {
    // Specs see the mapping, `src/shared/` and the shared package, nothing else. That keeps them readable as
    // acceptance criteria and stops them reaching into the DSL, or Playwright, behind the mapping's back.
    files: ["src/tests/**"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: thenMakesNoAction,
          message:
            "Arrange in a beforeEach on the given or when, not inside a then. A criterion asserts with get…/is…/can… questions; it does not act.",
        },
      ],
      "no-restricted-imports": restrictedImports({
        allowedPackages: [sharedPackage],
        paths: playwrightPackages.map(name => ({
          name,
          message: "Specs talk to the DSL, never to Playwright. Ask for what you need as a fixture instead.",
        })),
        patterns: [
          {
            // The mapping module itself is the one file specs may see; its neighbours are not.
            group: [
              "@src/acceptance-criteria-mapping/**",
              `!${acceptanceCriteriaMapping}`,
              "@src/dsl/**",
              "@src/tests/**",
            ],
            message: `A spec may import only '${acceptanceCriteriaMapping}' and '@src/shared/*'. Anything else belongs on the mapping's exports, or on the DSL reached through a fixture.`,
          },
        ],
      }),
    },
  },
  {
    // The mapping wires the DSL into Playwright, so it reaches down into `dsl/`, never back up.
    files: ["src/acceptance-criteria-mapping/**"],
    rules: {
      "no-restricted-imports": restrictedImports({
        allowedPackages: [sharedPackage],
        patterns: [
          {
            group: ["@src/tests/**"],
            message: "Imports run tests -> acceptance-criteria-mapping -> dsl -> shared, never back up.",
          },
        ],
      }),
    },
  },
  {
    // The DSL knows about the app, and nothing about how tests are declared.
    files: ["src/dsl/**"],
    rules: {
      "no-restricted-imports": restrictedImports({
        allowedPackages: [sharedPackage],
        patterns: [
          {
            group: ["@src/tests/**", "@src/acceptance-criteria-mapping/**"],
            message: "Imports run tests -> acceptance-criteria-mapping -> dsl -> shared, never back up.",
          },
        ],
      }),
    },
  },
  {
    // Playwright lives in `playwright/` folders and nowhere else. Every DSL object is a pair: the `*Dsl` that says what
    // a test may do, and the `*Playwright` beside it that drives the browser. A locator, a click or a wait outside a
    // `playwright/` folder cannot even be written.
    //
    // The one thing a `*Dsl` may name is `Page`, and only to build its own counterpart with in its constructor. The page
    // may be passed on, never kept, so it is out of scope in every method.
    files: ["src/dsl/**"],
    ignores: ["src/dsl/**/playwright/**"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: 'MemberExpression[object.type="ThisExpression"][property.name="page"]',
          message:
            "A *Dsl may not reach the page from a method. Take it in the constructor, build the *Playwright beside this file with it, and go through that.",
        },
        {
          selector: 'PropertyDefinition[key.name="page"], TSParameterProperty > Identifier[name="page"]',
          message:
            "A *Dsl may not keep the page. Take it as a plain constructor parameter, build the *Playwright beside this file with it, and let it go out of scope.",
        },
      ],
      "no-restricted-imports": restrictedImports({
        allowedPackages: [sharedPackage],
        paths: playwrightPackages.map(name => ({
          name,
          // `Page` is the exception, and only in `@playwright/test`.
          ...(name === "@playwright/test" ? {allowImportNames: ["Page"]} : {}),
          message:
            "Only a `playwright/` folder may import Playwright, apart from the `Page` a *Dsl constructor passes to its counterpart. Put the locator work in the *Playwright beside this file and call it from here.",
        })),
        patterns: [
          {
            group: ["@src/tests/**", "@src/acceptance-criteria-mapping/**"],
            message: "Imports run tests -> acceptance-criteria-mapping -> dsl -> shared, never back up.",
          },
        ],
      }),
    },
  },
  {
    // The bottom of the stack: helpers more than one layer needs.
    files: ["src/shared/**"],
    rules: {
      "no-restricted-imports": restrictedImports({
        allowedPackages: [sharedPackage],
        patterns: [
          {
            group: ["@src/tests/**", "@src/acceptance-criteria-mapping/**", "@src/dsl/**"],
            message: "`src/shared/` is the bottom of the stack and may not import the layers above it.",
          },
        ],
      }),
    },
  },
];
