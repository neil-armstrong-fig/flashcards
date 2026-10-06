import type {ResolveHook} from "node:module";

const SOURCE_ROOT = new URL("../src/", import.meta.url);

/** Resolves `@src/x/Y` to `src/x/Y.ts` under this package, so a script runs with the same imports the tests use. */
export const resolve: ResolveHook = (specifier, context, nextResolve) => {
  if (specifier.startsWith("@src/")) {
    return nextResolve(new URL(`${specifier.slice("@src/".length)}.ts`, SOURCE_ROOT).href, context);
  }

  return nextResolve(specifier, context);
};
