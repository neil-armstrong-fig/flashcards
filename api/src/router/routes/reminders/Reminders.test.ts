import {api} from "@src/testing/ApiHarness";
import {testDatabase} from "@src/database/testing/TestDatabase";

const ENDPOINT = "https://push.example.test/send/abc123";

async function signedIn(): Promise<string> {
  return await api.signIn();
}

it("hands a signed-in learner the key to subscribe with", async () => {
  const {workerEnvironment} = await import("@src/env/WorkerEnvironment");
  workerEnvironment.VAPID_PUBLIC_KEY = "the-public-key";

  const answer = await api.send("/api/reminders/key", {cookie: await signedIn()});

  expect(answer.status).toBe(200);
  expect(await answer.json()).toEqual({key: "the-public-key"});
});

it("keeps a device to remind, and moves its hour when it asks again", async () => {
  const cookie = await signedIn();

  await api.send("/api/reminders/subscription", {
    method: "PUT",
    cookie,
    body: {endpoint: ENDPOINT, hour: 20, timeZone: "Europe/London"},
  });
  const moved = await api.send("/api/reminders/subscription", {
    method: "PUT",
    cookie,
    body: {endpoint: ENDPOINT, hour: 18, timeZone: "Europe/London"},
  });

  expect(moved.status).toBe(204);
  expect(testDatabase.remindersKept).toHaveLength(1);
  expect(testDatabase.remindersKept[0]).toMatchObject({endpoint: ENDPOINT, hour: 18, timeZone: "Europe/London"});
});

it.each([
  ["an address that is not https", {endpoint: "http://push.example.test/x", hour: 20, timeZone: "Europe/London"}],
  ["an address that is not an address", {endpoint: "nonsense", hour: 20, timeZone: "Europe/London"}],
  ["an hour off the clock", {endpoint: ENDPOINT, hour: 24, timeZone: "Europe/London"}],
  ["an hour that is not whole", {endpoint: ENDPOINT, hour: 7.5, timeZone: "Europe/London"}],
  ["a time zone that does not exist", {endpoint: ENDPOINT, hour: 20, timeZone: "Mars/Olympus"}],
  ["nothing", {}],
])("refuses %s", async (_name, body) => {
  const answer = await api.send("/api/reminders/subscription", {method: "PUT", cookie: await signedIn(), body});

  expect(answer.status).toBe(400);
  expect(testDatabase.remindersKept).toHaveLength(0);
});

it("forgets a device that asks to stop", async () => {
  const cookie = await signedIn();
  await api.send("/api/reminders/subscription", {
    method: "PUT",
    cookie,
    body: {endpoint: ENDPOINT, hour: 20, timeZone: "Europe/London"},
  });

  const answer = await api.send("/api/reminders/subscription", {method: "DELETE", cookie, body: {endpoint: ENDPOINT}});

  expect(answer.status).toBe(204);
  expect(testDatabase.remindersKept).toHaveLength(0);
});

it("notes the day the goal was reached on each of the learner's devices", async () => {
  const cookie = await signedIn();
  await api.send("/api/reminders/subscription", {
    method: "PUT",
    cookie,
    body: {endpoint: ENDPOINT, hour: 20, timeZone: "Europe/London"},
  });

  const answer = await api.send("/api/reminders/goal-met", {method: "POST", cookie, body: {studyDay: "2026-10-01"}});

  expect(answer.status).toBe(204);
  expect(testDatabase.remindersKept[0]?.goalMetOn).toBe("2026-10-01");
});

it.each([
  ["a day that is not a date", {studyDay: "yesterday"}],
  ["a day that does not exist", {studyDay: "2026-13-45"}],
  ["nothing", {}],
])("refuses %s as the day the goal was reached", async (_name, body) => {
  const answer = await api.send("/api/reminders/goal-met", {method: "POST", cookie: await signedIn(), body});

  expect(answer.status).toBe(400);
});

it("answers 401 to the key without a session", async () => {
  expect((await api.send("/api/reminders/key")).status).toBe(401);
});

it.each([
  ["PUT", "/api/reminders/subscription"],
  ["DELETE", "/api/reminders/subscription"],
  ["POST", "/api/reminders/goal-met"],
])("answers 401 to %s %s without a session", async (method, path) => {
  const answer = await api.send(path, {method, body: {}});

  expect(answer.status).toBe(401);
});

it("answers 503 to the key where the Worker has none, so reminders are off", async () => {
  const {workerEnvironment} = await import("@src/env/WorkerEnvironment");
  Reflect.deleteProperty(workerEnvironment, "VAPID_PUBLIC_KEY");

  expect((await api.send("/api/reminders/key", {cookie: await signedIn()})).status).toBe(503);
});
