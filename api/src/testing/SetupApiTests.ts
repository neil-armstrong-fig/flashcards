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
vi.mock("@src/database/sync/SaveCardEvents", async () => ({
  saveCardEvents: (await import("@src/database/testing/TestDatabase")).testDatabase.saveCardEvents,
}));
vi.mock("@src/database/sync/ListCardEventsAfter", async () => ({
  listCardEventsAfter: (await import("@src/database/testing/TestDatabase")).testDatabase.listCardEventsAfter,
}));
vi.mock("@src/database/sync/SaveSettingChanges", async () => ({
  saveSettingChanges: (await import("@src/database/testing/TestDatabase")).testDatabase.saveSettingChanges,
}));
vi.mock("@src/database/sync/ListSettingChanges", async () => ({
  listSettingChanges: (await import("@src/database/testing/TestDatabase")).testDatabase.listSettingChanges,
}));
vi.mock("@src/database/sync/SaveRecordChanges", async () => ({
  saveRecordChanges: (await import("@src/database/testing/TestDatabase")).testDatabase.saveRecordChanges,
}));
vi.mock("@src/database/sync/ListRecordChangesAfter", async () => ({
  listRecordChangesAfter: (await import("@src/database/testing/TestDatabase")).testDatabase.listRecordChangesAfter,
}));
vi.mock("@src/database/reminders/SaveReminder", async () => ({
  saveReminder: (await import("@src/database/testing/TestDatabase")).testDatabase.saveReminder,
}));
vi.mock("@src/database/reminders/RemoveReminder", async () => ({
  removeReminder: (await import("@src/database/testing/TestDatabase")).testDatabase.removeReminder,
}));
vi.mock("@src/database/reminders/RecordGoalMet", async () => ({
  recordGoalMet: (await import("@src/database/testing/TestDatabase")).testDatabase.recordGoalMet,
}));
vi.mock("@src/database/reminders/ListReminders", async () => ({
  listReminders: (await import("@src/database/testing/TestDatabase")).testDatabase.listReminders,
}));
vi.mock("@src/database/reminders/MarkReminderSent", async () => ({
  markReminderSent: (await import("@src/database/testing/TestDatabase")).testDatabase.markReminderSent,
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
