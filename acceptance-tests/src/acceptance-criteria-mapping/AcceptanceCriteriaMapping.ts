import type {AcceptanceTestFixtures} from "@src/acceptance-criteria-mapping/AcceptanceTestFixtures";
import {test} from "@src/acceptance-criteria-mapping/AcceptanceTestFixtures";

type DefineSuite = () => void;

/**
 * A criterion sees the DSL and nothing else: no `page`, `context`, `browser` or `testInfo`.
 * Playwright stays on this side of the boundary, so a spec cannot reach past the DSL and start
 * driving the browser directly.
 */
type RunCriterion = (dsl: AcceptanceTestFixtures) => void | Promise<void>;

type PlaywrightTestBody = (fixtures: AcceptanceTestFixtures) => Promise<void>;

interface Suite {
  (criteria: string, define: DefineSuite): void;
  only(criteria: string, define: DefineSuite): void;
  skip(criteria: string, define: DefineSuite): void;
  /**
   * The same block, once per item, for a criterion that holds for every member of a set. Playwright
   * has no `describe.each`; this is its `for` loop with the given/when/then naming kept, so a failure
   * names the item that failed rather than the whole set.
   */
  each<Item>(items: readonly Item[], name: NameFor<Item>, define: DefineSuiteFor<Item>): void;
}

/** What one item of an `each` is called, as the name a reader sees in the report. */
type NameFor<Item> = (item: Item) => string;

/** The block an `each` repeats, handed the item it is being repeated for. */
type DefineSuiteFor<Item> = (item: Item) => void;

interface Criterion {
  (criteria: string, run: RunCriterion): void;
  only(criteria: string, run: RunCriterion): void;
  skip(criteria: string, run: RunCriterion): void;
}

/** The DSL as a type, for a spec's own helper that is handed one. A spec may import nothing but this module. */
export type WebApp = AcceptanceTestFixtures["webApp"];

/**
 * `given` / `when` / `then` are thin wrappers over Playwright's `test.describe` / `test` that
 * prefix the block name, so a test run reads back as the acceptance criteria it was written from:
 *
 *   given the learner opens the app > then today's goal is shown
 *
 * `then` is the test itself, which is why it, and only it, receives the DSL for asserting.
 */
export const given = suite("given");
export const when = suite("when");
export const then = criterion("then");

/**
 * The arrangement a `given` or a `when` has just named, carried out before each criterion beneath it.
 * Anything a `then` does to the app before asserting belongs up here, so the criterion stays the one
 * line the spec is about. It receives the DSL and nothing else, exactly as a criterion does.
 */
export const beforeEach = arrangement();

export {expect} from "@src/acceptance-criteria-mapping/AcceptanceTestFixtures";

function suite(prefix: string): Suite {
  const wrapped = (criteria: string, define: DefineSuite): void => {
    test.describe(`${prefix} ${criteria}`, define);
  };
  wrapped.only = (criteria: string, define: DefineSuite): void => {
    test.describe.only(`${prefix} ${criteria}`, define);
  };
  wrapped.skip = (criteria: string, define: DefineSuite): void => {
    test.describe.skip(`${prefix} ${criteria}`, define);
  };
  wrapped.each = <Item>(items: readonly Item[], name: NameFor<Item>, define: DefineSuiteFor<Item>): void => {
    for (const item of items) {
      test.describe(`${prefix} ${name(item)}`, () => {
        define(item);
      });
    }
  };

  return wrapped;
}

function criterion(prefix: string): Criterion {
  const wrapped = (criteria: string, run: RunCriterion): void => {
    test(`${prefix} ${criteria}`, withDslOnly(run));
  };
  wrapped.only = (criteria: string, run: RunCriterion): void => {
    test.only(`${prefix} ${criteria}`, withDslOnly(run));
  };
  wrapped.skip = (criteria: string, run: RunCriterion): void => {
    test.skip(`${prefix} ${criteria}`, withDslOnly(run));
  };

  return wrapped;
}

function arrangement(): (arrange: RunCriterion) => void {
  return (arrange: RunCriterion): void => {
    test.beforeEach(withDslOnly(arrange));
  };
}

/**
 * Rebuilds the argument object so a criterion receives only the DSL, whatever else Playwright
 * passed in. Types alone would stop at a cast; this stops at runtime too.
 *
 * The destructuring here is also how Playwright decides which fixtures to build (it reads the
 * parameter names off this function), so a fixture added to `AcceptanceTestFixtures` must be
 * named here as well.
 */
function withDslOnly(run: RunCriterion): PlaywrightTestBody {
  return async ({webApp, secondDevice}: AcceptanceTestFixtures): Promise<void> => {
    await run({webApp, secondDevice});
  };
}
