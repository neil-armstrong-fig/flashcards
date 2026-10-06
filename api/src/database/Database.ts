import {drizzle} from "drizzle-orm/d1";
import {workerEnvironment} from "@src/env/WorkerEnvironment";

/**
 * The Drizzle client over the Worker's D1 binding: the one thing every database function shares, so it is made once, here. A test
 * replaces the database functions themselves (`src/testing/SetupApiTests.ts`), so this is never loaded under node.
 *
 * D1 has no `BEGIN`/`COMMIT`, so each rule that must hold under two requests at once is a single statement that is conditional on
 * the state it expects: an `INSERT` that does nothing if the row is there.
 */
export const database = drizzle(workerEnvironment.DB);
