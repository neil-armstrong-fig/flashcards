import {generateKeyPairSync} from "node:crypto";
import {sendDueReminders} from "@src/reminders/SendDueReminders";
import {testDatabase} from "@src/database/testing/TestDatabase";
import {workerEnvironment} from "@src/env/WorkerEnvironment";

const EIGHT_IN_LONDON = new Date("2026-10-01T19:00:00Z");
const ENDPOINT = "https://push.example.test/send/abc123";

function base64UrlOf(bytes: Uint8Array): string {
  return Buffer.from(bytes).toString("base64url");
}

beforeEach(() => {
  const pair = generateKeyPairSync("ec", {namedCurve: "prime256v1"});
  const {x = "", y = ""} = pair.publicKey.export({format: "jwk"});
  const {d = ""} = pair.privateKey.export({format: "jwk"});

  workerEnvironment.VAPID_PUBLIC_KEY = base64UrlOf(
    new Uint8Array([4, ...Buffer.from(x, "base64url"), ...Buffer.from(y, "base64url")]),
  );
  workerEnvironment.VAPID_PRIVATE_KEY = d;
  workerEnvironment.VAPID_SUBJECT = "mailto:owner@example.com";
  vi.spyOn(console, "error").mockImplementation(() => undefined);
});

afterEach(() => {
  Reflect.deleteProperty(workerEnvironment, "VAPID_PUBLIC_KEY");
  Reflect.deleteProperty(workerEnvironment, "VAPID_PRIVATE_KEY");
  Reflect.deleteProperty(workerEnvironment, "VAPID_SUBJECT");
});

function pushServiceAnswering(status: number): ReturnType<typeof vi.fn> {
  const fetchMock = vi.fn(async () => new Response(null, {status}));

  vi.stubGlobal("fetch", fetchMock);

  return fetchMock;
}

async function remindingAt(hour: number, endpoint = ENDPOINT): Promise<void> {
  await testDatabase.saveReminder("account-1", {endpoint, hour, timeZone: "Europe/London"});
}

it("pushes, signed for the push service, to a device whose hour it is", async () => {
  const fetchMock = pushServiceAnswering(201);
  await remindingAt(20);

  await sendDueReminders(EIGHT_IN_LONDON);

  expect(fetchMock).toHaveBeenCalledTimes(1);
  const [address, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];

  expect(address).toBe(ENDPOINT);
  expect(init.method).toBe("POST");
  expect(new Headers(init.headers).get("Authorization")).toMatch(/^vapid t=.+\..+\..+, k=.+$/);
});

it("does not push at any other hour", async () => {
  const fetchMock = pushServiceAnswering(201);
  await remindingAt(19);

  await sendDueReminders(EIGHT_IN_LONDON);

  expect(fetchMock).not.toHaveBeenCalled();
});

it("does not push to a device whose goal was reached today", async () => {
  const fetchMock = pushServiceAnswering(201);
  await remindingAt(20);
  await testDatabase.recordGoalMet("account-1", "2026-10-01");

  await sendDueReminders(EIGHT_IN_LONDON);

  expect(fetchMock).not.toHaveBeenCalled();
});

it("pushes only once a study day, even if the cron runs twice", async () => {
  const fetchMock = pushServiceAnswering(201);
  await remindingAt(20);

  await sendDueReminders(EIGHT_IN_LONDON);
  await sendDueReminders(EIGHT_IN_LONDON);

  expect(fetchMock).toHaveBeenCalledTimes(1);
});

it("forgets a device the push service says has gone", async () => {
  pushServiceAnswering(410);
  await remindingAt(20);

  await sendDueReminders(EIGHT_IN_LONDON);

  expect(testDatabase.remindersKept).toHaveLength(0);
});

it("keeps a device, and tries it again, when the push service fails", async () => {
  pushServiceAnswering(500);
  await remindingAt(20);

  await sendDueReminders(EIGHT_IN_LONDON);

  expect(testDatabase.remindersKept).toHaveLength(1);
  expect(testDatabase.remindersKept[0]?.lastSentOn).toBeUndefined();
});

it("carries on to the next device when one cannot be pushed to", async () => {
  const fetchMock = vi.fn(async (address: string) => {
    if (address === ENDPOINT) {
      throw new Error("The network is down.");
    }

    return new Response(null, {status: 201});
  });

  vi.stubGlobal("fetch", fetchMock);
  await remindingAt(20);
  await remindingAt(20, "https://push.example.test/send/second");

  await sendDueReminders(EIGHT_IN_LONDON);

  expect(fetchMock).toHaveBeenCalledTimes(2);
});
