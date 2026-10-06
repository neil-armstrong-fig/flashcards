# AGENTS.md: tests

```ts
import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

given("the learner starts reviewing the starter deck", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.startReviewing();
  });

  when("the answer is shown", () => {
    beforeEach(async ({webApp}) => {
      await webApp.review.showAnswer();
    });

    then("the meaning is shown", async ({webApp}) => {
      expect(await webApp.review.getBackText()).toContain("water");
    });
  });
});
```

`given` and `when` are `test.describe`; `then` is `test`, which is why only `then` (and `beforeEach`) receive the DSL. The
fixture is always destructured as `webApp`: the lint rule below looks for that name.

## Arrange in a `beforeEach`, assert in the `then`

**A `then` states one criterion and checks it. It does not set anything up.** Whatever a `given` or a `when` says has happened
is made to happen in a `beforeEach` on that block, so the criterion is the only thing in the test body. Otherwise every sibling
criterion repeats the same lines and the one it is about is buried.

**A lint rule enforces it**, and it is the inverse of janggi's (https://github.com/neil-armstrong-fig/janggi): inside a `then`, any call on `app` (`webApp.x()`, `webApp.area.x()`,
`webApp.area.sub.x()`) must be named `get…`, `is…` or `can…`. Anything else is an action and fails `pnpm checks`. Nothing needs
keeping in step: a new DSL action is refused in a `then` by default. Expect matchers are not calls on `webApp`, so they are fine.

`beforeEach` is exported from `AcceptanceCriteriaMapping`. It receives the DSL and nothing else, exactly as a criterion does.

## Shape

- **Write the full `given` / `when` / `then` nesting, even where a `given` holds one `when`.** The root `AGENTS.md`'s ban on a
  wrapper `describe` is for unit tests restating their filename. Here the nesting is the acceptance criterion.
- **Name a spec as a sentence:** `src/tests/<feature-area>/<SentenceLikeName>.test.ts` (`review/RatingACard.test.ts`). The
  folder matches the app's section and the DSL's `components/` folder of the same name.
- **A criterion is read in the learner's words**, not the code's: "that card is no longer waiting", not "the due count is 9".
- **Where the setup differs between criteria, that is a second `when`**, not a shared one.
- **`when.each` / `given.each`** write one suite per item where a criterion holds for every member of a set. Playwright has no
  `describe.each`, and `each` is its `for` loop with the naming kept. One suite per item beats one criterion looping inside
  itself: each gets its own page and a failure names the item. A list declared in the spec rather than imported must sit above
  the `given`, because `each` runs when the file is collected.
- **A spec's own helper** takes the DSL as the `WebApp` type exported from the mapping, since a spec may import nothing else
  (`RatingACard.test.ts`'s `rateRemainingCards`). Arrangement in a helper is fine: the lint rule only watches `then` bodies.
- **Cover what a learner can do.** A state too deep to tap out (a year of reviews) is a unit test on the pure function in
  `webapp/src/spaced-repetition/`, not a spec leaning on a door into the app.
