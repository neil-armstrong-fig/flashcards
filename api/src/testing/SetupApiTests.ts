import {afterEach, beforeEach, vi} from "vitest";
import {testDatabase} from "@src/database/testing/TestDatabase";
import {testGoogle} from "@src/testing/google/TestGoogle";
import {workerEnvironment} from "@src/env/WorkerEnvironment";

/**
 * Runs before every test file (`vitest.config.ts`). The Worker's code calls plain functions that reach out, to D1 and to Google, and
 * here each is replaced by an in-memory one, so a test of a route runs the real route over a world it controls. A test of one of those
 * functions themselves puts the real one back with `vi.unmock`.
 */
vi.mock("@src/database/accounts/FindOrCreateAccount", async () => ({
  findOrCreateAccount: (await import("@src/database/testing/TestDatabase")).testDatabase.findOrCreateAccount,
}));
vi.mock("@src/database/sessions/CreateSession", async () => ({
  createSession: (await import("@src/database/testing/TestDatabase")).testDatabase.createSession,
}));
vi.mock("@src/database/sessions/DeleteSession", async () => ({
  deleteSession: (await import("@src/database/testing/TestDatabase")).testDatabase.deleteSession,
}));
vi.mock("@src/database/sessions/AccountOfSession", async () => ({
  accountOfSession: (await import("@src/database/testing/TestDatabase")).testDatabase.accountOfSession,
}));
vi.mock("@src/database/similar/ListSimilarWords", async () => ({
  listSimilarWords: (await import("@src/database/testing/TestDatabase")).testDatabase.listSimilarWords,
}));
vi.mock("@src/database/similar/DeleteSimilarWord", async () => ({
  deleteSimilarWord: (await import("@src/database/testing/TestDatabase")).testDatabase.deleteSimilarWord,
}));
vi.mock("@src/database/similar/SaveSimilarWord", async () => ({
  saveSimilarWord: (await import("@src/database/testing/TestDatabase")).testDatabase.saveSimilarWord,
}));
vi.mock("@src/database/notes/ListNotes", async () => ({
  listNotes: (await import("@src/database/testing/TestDatabase")).testDatabase.listNotes,
}));
vi.mock("@src/database/notes/SaveNote", async () => ({
  saveNote: (await import("@src/database/testing/TestDatabase")).testDatabase.saveNote,
}));
vi.mock("@src/database/notes/UpdateNote", async () => ({
  updateNote: (await import("@src/database/testing/TestDatabase")).testDatabase.updateNote,
}));
vi.mock("@src/database/notes/DeleteNote", async () => ({
  deleteNote: (await import("@src/database/testing/TestDatabase")).testDatabase.deleteNote,
}));
vi.mock("@src/router/sign-in/shared/google/GoogleIdentityOf", async () => ({
  googleIdentityOf: (await import("@src/testing/google/TestGoogle")).testGoogle.identityOf,
}));
vi.mock("@src/router/sign-in/shared/utils/LoginAllowed", () => ({loginAllowed: async () => true}));

export const SITE = "https://site.example";

beforeEach(() => {
  testDatabase.reset();
  testGoogle.reset();
  workerEnvironment.ALLOWED_ORIGINS = `${SITE},http://localhost:3000`;
  workerEnvironment.ALLOWED_EMAILS = "me@example.com";
  workerEnvironment.GOOGLE_OAUTH_CLIENT_ID = "client-id.apps.googleusercontent.com";
  vi.useFakeTimers({toFake: ["Date"], now: new Date("2026-10-01T12:00:00Z")});
});

afterEach(() => {
  vi.useRealTimers();
  Reflect.deleteProperty(workerEnvironment, "ALLOWED_ORIGINS");
  Reflect.deleteProperty(workerEnvironment, "ALLOWED_EMAILS");
  Reflect.deleteProperty(workerEnvironment, "GOOGLE_OAUTH_CLIENT_ID");
});
