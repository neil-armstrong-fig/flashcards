# AGENTS.md: dsl

Each thing is a pair, side by side:

- **`<Thing>Dsl.ts`**: what a spec is allowed to say. It holds no locators. Each method is a call straight down into its
  counterpart, wrapped in `try`/`catch` that rethrows a `DslError("Failed to …", cause)` naming the intention, so a failure
  reads "Failed to rate the card good" rather than a raw locator timeout. **It takes a `Page` in its constructor and builds its
  own counterpart with it, privately, and that is all it may do with a page.** It never keeps one, so the browser can only be
  reached through the counterpart. Both are lint rules: `Page` is the single name a `*Dsl` may import from `@playwright/test`,
  and storing it or reaching `this.page` is an error.
- **`playwright/<Thing>Playwright.ts`**: the locators, clicks and waits. It catches nothing: let Playwright's error out and let
  the `*Dsl` name what was attempted. Wrapping in both places buries the real cause. **It keeps no state between calls:** its
  members are locators and helpers, and what a method needs to know comes from the app (the DOM, the URL), never a field an
  earlier call wrote. Steps can then be reordered or moved into a `beforeEach` without the object disagreeing with the browser.

```
src/dsl/
  playwright/                     BasePage, BaseComponent: shared by every playwright/ folder
  errors/DslError.ts
  testid-contract.md              every data-testid the DSL relies on
  web-app/
    WebAppDsl.ts                     the root: opens the app, reloads, passes days
    playwright/WebAppPlaywright.ts
    components/
      home/    HomeDsl.ts  playwright/HomePlaywright.ts
      review/  ReviewDsl.ts  playwright/ReviewPlaywright.ts
        components/  memory-aid/  sound/  struggling/  similar/   (a sub-DSL each: `webApp.review.memoryAid.addNote(...)`)
```

**This tree and the app's are deliberately the same shape.** `components/home` and `components/review` match
`webapp/src/react/pages/home` and `review`. Split or rename a section on one side and do the same on the other. A thing owns
its `playwright/` counterpart and everything inside it goes in its own `components/` folder, to any depth.

**Only a `playwright/` folder may import Playwright** (lint enforces it), apart from the `Page` above.
`AcceptanceTestFixtures` is exempt, because handing the browser to the DSL has to happen somewhere.

## Where a method goes

`webApp` is the whole application and every area hangs off it as a member (`webApp.home`, `webApp.review`). **The root owns the
browser**: opening the app, reloading, moving the clock. **Each member answers for its own part of the screen.** Add an area as
a new member, never as a new fixture: a second fixture is a second thing to navigate and keep in step. A new fixture, if one is
ever justified, must also be named in `withDslOnly`'s destructuring in `AcceptanceCriteriaMapping.ts`, because Playwright reads
that to decide which fixtures to build, and one missing from it is silently never constructed.

**A `*Dsl` that grows past about a screenful of unrelated methods is split into sub-DSLs**, one per part of the screen, each a
child with its own `playwright/` counterpart in the parent's `components/` (`ReviewDsl` has `memoryAid`, `sound`, `struggling` and
`similar`). Methods move whole, and a private helper goes with the group that uses it. Specs reach them by name
(`webApp.review.memoryAid.addNote(...)`).

In a `*Dsl`, the counterpart comes first, then the children, constructor in the same order, with a blank line between: the
counterpart is this object's own half of the pair (private, the only route to the browser) and the children are areas of the
screen (public, reached by name).

## Naming a DSL method

A criterion should read as a sentence, so the name carries its own grammar. Every method is one of three shapes, and a `then`
may call only the last two (lint enforces it by this name):

| Shape                                 | Named                                            | Reads as                                                  |
| ------------------------------------- | ------------------------------------------------ | --------------------------------------------------------- |
| **Action**: does something to the app | a verb: `rate`, `bury`, `showAnswer`, `passDays` | `await webApp.review.rate("good")`                        |
| **Question**: answers yes or no       | `is…` / `can…`: `isAnswerShown`, `canRate`       | `expect(await webApp.review.canRate("good")).toBe(false)` |
| **Query**: fetches a value            | `get…`: `getFrontText`, `getCardsDueToday`       | `expect(await webApp.home.getCardsDueToday()).toBe(10)`   |

A bare noun phrase (`cardsDue()`) reads like a property that needs brackets, and a verb that returns a value reads like an
instruction whose answer you are meant to ignore. Both are refused by the rule.

## Locators

Locate by `data-testid`, the contract with the webapp; `testid-contract.md` spells it all out. Prefer waiting over sampling,
since React mounts after `goto` resolves (`await locator.waitFor()`, not `locator.isVisible()` first). An action that changes the
screen waits for the new state before it returns. Never `waitForTimeout`.
