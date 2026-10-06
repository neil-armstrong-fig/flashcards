import {register} from "node:module";

// Node runs TypeScript by stripping its types, but knows nothing of the `@src/*` alias the code is written with.
register("./AliasHooks.ts", import.meta.url);
