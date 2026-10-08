import {IDBFactory} from "fake-indexeddb";
import {vi} from "vitest";

/**
 * A browser that has never stored anything: a new IndexedDB, and the app's modules loaded afresh, since each remembers the connection it
 * opened to the last one. A test calls this first, then imports the module it is about, so the real database code runs. The stand-ins
 * `SetupWebappTests.ts` puts in place of the storage modules are taken off by `vi.unmock` in that test.
 */
export function freshIndexedDb(): void {
  vi.stubGlobal("indexedDB", new IDBFactory());
  vi.resetModules();
}
